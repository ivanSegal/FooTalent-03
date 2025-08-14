package com.Incamar.IncaCore.controller;

import com.Incamar.IncaCore.documentation.auth.*;
import com.Incamar.IncaCore.dtos.auth.*;
import com.Incamar.IncaCore.dtos.auth.LoginRes;
import com.Incamar.IncaCore.dtos.auth.CredentialsRes;
import com.Incamar.IncaCore.services.AuthService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "01 - Autenticación",
        description = "Endpoints para autenticación de usuarios y gestión de cuentas")
public class AuthController {

    private final AuthService authService;

    @RegisterEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterReq request) {
        CredentialsRes response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(response, "Registro completado con éxito"));
    }

    @LoginEndpointDoc
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginReq request) {
        LoginRes response = authService.login(request);
        return ResponseEntity.ok(ApiResult.success(response, "Inicio de sesión exitoso"));
    }

    @LogoutEndpointDoc
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        authService.logout(token);
        return ResponseEntity.ok(ApiResult.success(null, "Logout exitoso"));
    }

    @ChangePasswordEndpointDoc
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePasswordReq request) {
        authService.changePassword(request);
        return ResponseEntity.ok(ApiResult.success("Contraseña cambiada correctamente"));
    }

    @ChangePasswordTempEndpointDoc
    @PostMapping("/change-password/temporary")
    public ResponseEntity<?> changePasswordTemp(@RequestBody @Valid ChangePasswordTempReq request) {
        ChangePasswordReq newRequest = new ChangePasswordReq(null, request.newPassword());
        ChangePasswordTempRes response = authService.changePassword(newRequest);
        return ResponseEntity.ok(ApiResult.success(response, "Contraseña temporal cambiada correctamente"));
    }

    @ForgotPasswordEndpointDoc
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForgotPasswordReq request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResult.success("Se ha enviado un correo para restablecer tu contraseña"));
    }

    @ResetPasswordEndpointDoc
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordReq request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResult.success("Contraseña restablecida correctamente"));
    }

    @AdminResetPasswordDoc
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/reset-password")
    public ResponseEntity<?> adminResetPassword(@RequestBody @Valid AdminResetPasswordReq request) {
        CredentialsRes tempPassword = authService.adminResetPassword(request);
        return ResponseEntity.ok(ApiResult.success(tempPassword, "Contraseña restablecida para el usuario"));
    }
}
