package com.Incamar.IncaCore.dtos.users;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Schema(
        name = "User.UserRequest",
        description = "Datos requeridos para la creación de un usuario"
)
public class UserRequestDto {
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(min = 4, max = 20, message = "El nombre de usuario debe tener entre 4 y 20 caracteres")
    @Pattern(
            regexp = "^[a-zA-Z0-9._]+$",
            message = "El nombre de usuario solo puede contener letras, números, puntos y guiones bajos"
    )
    @Schema(
            description = "Nombre de usuario único. Solo acepta letras, números, puntos y guiones bajos",
            example = "juan.perez_92",
            minLength = 4,
            maxLength = 20,
            pattern = "^[a-zA-Z0-9._]+$"
    )
    private String username;
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$",
            message =
                    "La contraseña debe contener mayúsculas, minúsculas, números y símbolos"
    )
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 8, max = 30, message = "La contraseña debe tener entre 8 y 30 caracteres")
    @Schema(
            description =
                    "Contraseña segura que debe contener al menos: una mayúscula, una minúscula, "
                            + "un número y un símbolo especial",
            example = "MiContraseña123!",
            format = "password",
            minLength = 8,
            maxLength = 30,
            pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$"
    )
    private String password;
    @NotBlank(message = "El rol no puede estar vacío")
    @Pattern(
            regexp = "ADMIN|OPERATIONS_MANAGER|WAREHOUSE_STAFF",
            message = "El rol debe ser uno de los siguientes: ADMIN, OPERATIONS_MANAGER, WAREHOUSE_STAFF"
    )
    @Schema(
            description = "Rol del usuario. Valores válidos: ADMIN, OPERATIONS_MANAGER, WAREHOUSE_STAFF",
            example = "ADMIN"
    )
    private String role;
    @NotNull(message = "La fecha de creación no puede ser nula")
    @Schema(
            description = "Fecha y hora de creación del usuario en formato ISO 8601",
            example = "2025-08-05T14:30:00"
    )
    private LocalDateTime createdAt;
}
