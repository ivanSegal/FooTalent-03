package com.Incamar.IncaCore.dtos.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "Auth.Admin.ResetPassword",
        description = "Petición para que un administrador restablezca la contraseña de un usuario.",
        requiredProperties = {"username"})
public record AdminResetPasswordReq(

        @Schema(description = "Nombre de usuario de la cuenta a la que se desea restablecer la contraseña.", example = "jperez01")
        @NotBlank(message = "username es requerido")
        String username

) {}
