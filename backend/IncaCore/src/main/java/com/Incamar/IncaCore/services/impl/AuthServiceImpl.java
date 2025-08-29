package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.auth.*;
import com.Incamar.IncaCore.dtos.auth.LoginRes;
import com.Incamar.IncaCore.dtos.users.UserSearchRes;
import com.Incamar.IncaCore.models.Employee;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.enums.TokenPurpose;
import com.Incamar.IncaCore.exceptions.InvalidPasswordException;
import com.Incamar.IncaCore.exceptions.InvalidTokenException;
import com.Incamar.IncaCore.exceptions.UserNotFoundException;
import com.Incamar.IncaCore.mappers.EmployeeMapper;
import com.Incamar.IncaCore.mappers.UserMapper;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.security.service.JwtService;
import com.Incamar.IncaCore.security.CustomUserDetails;
import com.Incamar.IncaCore.services.AuthService;
import com.Incamar.IncaCore.services.EmailService;
import com.Incamar.IncaCore.services.TokenBlacklistService;
import com.Incamar.IncaCore.utils.TemporaryPasswordGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    // --- Repositories ---
    private final UserRepository userRepository;

    // --- Security & Auth ---
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    // --- Services ---
    private final EmailService emailService;

    // --- Mappers ---
    private final UserMapper userMapper;
    private final EmployeeMapper employeeMapper;

    // --- Utilities ---
    private final TemporaryPasswordGenerator passwordGenerator;

    // --- Configuration values ---
    @Value("${frontend.baseUrl}")
    private String baseUrl;

    @Value("${frontend.verifyEmailUrl}")
    private String resetPasswordUrl;


    // --------------------------------------------
    // Implementación de métodos públicos (API)
    // --------------------------------------------

    /**
     * Registra un nuevo usuario y empleado, genera credenciales y envía email si aplica.
     */
    @Override
    @Transactional
    public UserSearchRes register(RegisterReq request) {
        String rawPassword = passwordGenerator.generate(8);
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = userMapper.toUser(request, encodedPassword);
        Employee employee = employeeMapper.toEmployee(request, user);
        user.setEmployee(employee);

        User savedUser = userRepository.save(user);

        sendWelcomeEmail(savedUser, savedUser.getEmployee(), rawPassword);

        return userMapper.toUserSearchRes(savedUser);
    }

    /**
     * Realiza la autenticación y genera JWT para el usuario.
     */
    @Override
    public LoginRes login(LoginReq request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String token = jwtService.generateToken(userMapper.toJwtDataDto(user), TokenPurpose.AUTHENTICATION);
        return new LoginRes(token);
    }

    /**
     * Agrega el token a la blacklist para cerrar sesión.
     */
    @Override
    public void logout(String token) {
        LocalDateTime expiration = jwtService.extractExpiration(token);
        tokenBlacklistService.addTokenToBlacklist(token, expiration);
    }

    /**
     * Cambia la contraseña, validando contraseña actual si no es temporal.
     * Genera nuevo token de autenticación.
     */
    @Override
    public void changePassword(ChangePasswordReq request) {
        User currentUser = getAuthenticatedUser()
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.currentPassword(), currentUser.getPassword())) {
            throw new InvalidPasswordException("La contraseña actual es incorrecta");
        }

        currentUser.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(currentUser);
    }

    /**
     * Inicia el proceso de recuperación de contraseña enviando email con token.
     */
    @Override
    public void forgotPassword(ForgotPasswordReq request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        String token = jwtService.generateToken(userMapper.toJwtDataDto(user), TokenPurpose.RESET_PASSWORD);
        sendPasswordResetEmail(user, token);
    }

    /**
     * Resetea la contraseña verificando token y la actualiza en la base de datos.
     */
    @Transactional
    @Override
    public void resetPassword(ResetPasswordReq request) {
        TokenPurpose purpose = jwtService.extractPurpose(request.token());
        if (!TokenPurpose.RESET_PASSWORD.equals(purpose)) {
            throw new InvalidTokenException("El token no es válido para recuperar contraseña");
        }

        String email = jwtService.extractEmail(request.token());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (!jwtService.isTokenValid(request.token(), userDetails)) {
            throw new InvalidTokenException("Token inválido o expirado");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        tokenBlacklistService.addTokenToBlacklist(request.token(), jwtService.extractExpiration(request.token()));
    }

    /**
     * Obtiene el usuario autenticado actualmente.
     */
    public Optional<User> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        String username = authentication.getName();
        return userRepository.findByEmail(username);
    }

    // --------------------------------------------
    // Métodos privados auxiliares
    // --------------------------------------------

    /**
     * Envía email de bienvenida con credenciales.
     */
    private void sendWelcomeEmail(User user, Employee employee, String rawPassword) {
        Map<String, Object> variables = Map.of(
                "name", employee.getFirstName() + " " + employee.getLastName(),
                "email", user.getEmail(),
                "password", rawPassword,
                "loginUrl", baseUrl
        );

        emailService.sendHtmlEmail(
                user.getEmail(),
                "Bienvenido a IncaCore",
                "user-credentials",
                variables
        );
    }

    /**
     * Envía email para recuperación de contraseña.
     */
    private void sendPasswordResetEmail(User user, String token) {
        Map<String, Object> templateModel = Map.of(
                "name", user.getEmployee().getFirstName() + " " + user.getEmployee().getLastName(),
                "recoveryPasswordUrl", baseUrl + resetPasswordUrl + "?token=" + token
        );

        emailService.sendHtmlEmail(
                user.getEmail(),
                "Recuperación de contraseña",
                "password-recovery",
                templateModel
        );
    }



}
