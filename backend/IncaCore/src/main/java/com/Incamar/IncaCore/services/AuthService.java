package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.dtos.users.LoginRequestDto;
import com.Incamar.IncaCore.dtos.users.RegisterRequestDto;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.exceptions.BadRequestException;
import com.Incamar.IncaCore.exceptions.ConflictException;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.exceptions.ServiceUnavailableException;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final UserService userService;



  @Transactional
  public void register(RegisterRequestDto request) {
    if (!request.getPassword().equals(request.getConfirmPassword())) {
      throw new BadRequestException("La confirmación de contraseña no coincide");
    }
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new ConflictException("El email ya está en uso");
    }
    User u = new User();
    u.setUsername(request.getUsername());
    u.setPassword(passwordEncoder.encode(request.getPassword()));
    u.setRole(Role.valueOf(request.getRole()));
    userRepository.save(u);
  }

  public String login(LoginRequestDto request) {
    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
      );
    } catch (BadCredentialsException ex) {
      throw new BadRequestException("Credenciales inválidas");
    }
    JwtDataDto jwtDataDto = new JwtDataDto();
    jwtDataDto.setUuid(user.getId());
    jwtDataDto.setUsername(user.getUsername());
    jwtDataDto.setRole(user.getRole().name());
    return jwtService.generateToken(jwtDataDto);
  }
}
