package com.Incamar.IncaCore.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(name = "Auth.ChangePasswordTemporal",
        description = "Datos necesarios para cambiar la contraseña de un usuario autenticado con contraseña temporal.",
        requiredProperties = {"newPassword"}
)
public record ChangePasswordTempReq(

        @Schema(description = "Nueva contraseña del usuario.", example = "P@ssw0rd!")
        @NotBlank(message = "La nueva contraseña es requerido")
        @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8 y 64 caracteres")
        @Pattern(regexp = "^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\\d)(?=.*[-@#$%^&*.,()_+{}|;:'\"<>/!¡¿?])[A-ZÑa-zñ\\d-@#$%^&*.,()_+{}|;:'\"<>/!¡¿?]{6,}$",
                message = "La contraseña debe contener al menos una letra mayuscula, una letra minuscula, un numero, y un caracter especial.")
        String newPassword
) {
}
