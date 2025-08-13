package com.Incamar.IncaCore.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "Auth.ForgotPassword",
        description = "Petición para iniciar el proceso de recuperación de contraseña.",
        requiredProperties = {"username"})
public record ForgotPasswordReq(

        @Schema(description = "Nombre de usuario asociado a la cuenta para la que se solicita la recuperación de contraseña.", example = "jperez01")
        @NotBlank(message = "username es requerido")
        String username

) {}
