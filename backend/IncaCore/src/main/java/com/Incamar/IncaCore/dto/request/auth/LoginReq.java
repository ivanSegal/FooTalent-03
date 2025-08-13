package com.Incamar.IncaCore.dto.request.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(name = "Auth.Login",
        description = "Credenciales necesarias para iniciar sesión en el sistema.",
        requiredProperties = {"username","password"}
)
public record LoginReq(

        @Schema(description = "Nombre de usuario único registrado en el sistema.", example = "jperez01")
        @NotBlank(message = "El username es requerido")
        String username,

        @Schema(description = "Contraseña del usuario asociada al nombre de usuario.", example = "P@ssw0rd!")
        @NotBlank(message = "La contraseña es requerida")
        @Size(min = 8, max = 64, message = "password debe tener entre 8 y 64 caracteres")
        @Pattern(regexp = "^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\\d)(?=.*[-@#$%^&*.,()_+{}|;:'\"<>/!¡¿?])[A-ZÑa-zñ\\d-@#$%^&*.,()_+{}|;:'\"<>/!¡¿?]{6,}$",
                message = "La contraseña debe contener al menos una letra mayuscula, una letra minuscula, un numero, y un caracter especial.")
        String password

) {}
