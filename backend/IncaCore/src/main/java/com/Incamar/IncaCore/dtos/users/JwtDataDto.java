package com.Incamar.IncaCore.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(
    name = "Auth.JwtDataDto",
    description = "Datos del token JWT que contiene información del usuario autenticado"
)
public class JwtDataDto {

  @Schema(
      description = "Identificador único del usuario en formato UUID",
      example = "123e4567-e89b-12d3-a456-426614174000"
  )
  private UUID uuid;

  @Schema(
      description = "Nombre de usuario único. Solo acepta letras, números, puntos y guiones bajos",
      example = "juan.perez_92"
  )
  private String username;

  @Schema(
      description = "Rol o nivel de permisos del usuario en el sistema",
      example = "USER",
      allowableValues = {"ADMIN", "USER"}
  )
  private String role;
}
