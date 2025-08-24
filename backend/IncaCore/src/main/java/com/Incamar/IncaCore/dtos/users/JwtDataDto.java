package com.Incamar.IncaCore.dtos.users;

import com.Incamar.IncaCore.enums.Department;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

public record JwtDataDto(
        @Schema(description = "Identificador único del usuario en formato UUID", example = "123e4567-e89b-12d3-a456-426614174000")
        UUID id,

        @Schema(description = "Email del usuario", example = "juan.perez_92@example.com")
        String email,

        @Schema(description = "Rol o nivel de permisos del usuario en el sistema", example = "USER", allowableValues = {"ADMIN", "USER"})
        String role,

        @Schema(description = "Departamento del usuario en el sistema", example = "VESSEL", allowableValues = {"VESSEL", "INVENTORY","MAINTENANCE"})
        Department department,

        @Schema(description = "Indica si la contraseña actual es temporal", example = "true", allowableValues = {"true", "false"})
        boolean temporaryPassword
) {
}
