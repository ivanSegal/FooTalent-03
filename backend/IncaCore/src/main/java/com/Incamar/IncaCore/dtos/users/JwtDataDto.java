package com.Incamar.IncaCore.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

public record JwtDataDto(
        @Schema(description = "Identificador único del usuario en formato UUID", example = "123e4567-e89b-12d3-a456-426614174000")
        UUID id,

        @Schema(description = "Nombre de usuario único. Solo acepta letras, números, puntos y guiones bajos", example = "juan.perez_92")
        String username,

        @Schema(description = "Rol o nivel de permisos del usuario en el sistema", example = "USER", allowableValues = {"ADMIN", "USER"})
        String role,

        @Schema(description = "Indica si la contraseña actual es temporal", example = "true", allowableValues = {"true", "false"})
        boolean temporaryPassword
) {
}
