package com.Incamar.IncaCore.dtos.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(name = "Auth.ChangePasswordRequest",
        description = "Datos necesarios para cambiar la contraseña de un usuario autenticado.",
        requiredProperties = {"currentPassword","newPassword"})
public record ChangePasswordReq(

        @Schema(description = "Contraseña actual del usuario.", example = "P@ssw0rd!")
        @NotBlank(message = "La contraseña actual es requerida")
        @Size(min = 8, max = 64, message = "newPassword debe tener entre 8 y 64 caracteres")
        @Pattern(regexp = "^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\\d)(?=.*[-@#$%^&*.,()_+{}|;:'\"<>/!¡¿?])[A-ZÑa-zñ\\d-@#$%^&*.,()_+{}|;:'\"<>/!¡¿?]{6,}$",
                message = "La contraseña debe contener al menos una letra mayuscula, una letra minuscula, un numero, y un caracter especial.")
        String currentPassword,

        @Schema(description = "Nueva contraseña del usuario.", example = "Nu3v0P@ssw0rd!")
        @NotBlank(message = "La nueva contraseña es requerida")
        @Size(min = 8, max = 64, message = "newPassword debe tener entre 8 y 64 caracteres")
        @Pattern(regexp = "^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\\d)(?=.*[-@#$%^&*.,()_+{}|;:'\"<>/!¡¿?])[A-ZÑa-zñ\\d-@#$%^&*.,()_+{}|;:'\"<>/!¡¿?]{6,}$",
                message = "La contraseña debe contener al menos una letra mayuscula, una letra minuscula, un numero, y un caracter especial.")
        String newPassword

) {}
