package com.Incamar.IncaCore.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.UUID;

@Data
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
      description = "Username del usuario",
      example = "Germa32"
  )
  private String username;

  @Schema(
      description = "Rol o nivel de permisos del usuario en el sistema",
      example = "USER",
      allowableValues = {"ADMIN", "USER"}
  )
  private String role;
}
