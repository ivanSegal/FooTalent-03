package com.Incamar.IncaCore.utils;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Schema(description = "Estructura estándar de respuesta de la API")
public class ApiResult<T> {  // <-- aquí se declara la clase genérica

  @Schema(description = "Indica si la operación fue exitosa",
      example = "true",
      required = true)
  private boolean success;

  @Schema(description = "Mensaje descriptivo de la respuesta",
      example = "Operación exitosa",
      required = true,
      maxLength = 500)
  private String message;

  @Schema(description = "Datos retornados por la API (puede ser null si no hay datos)")
  private T data;

  public static <T> ApiResult<T> success(T data, String message) {
    return new ApiResult<>(true, message, data);
  }

  public static <T> ApiResult<T> success(String message) {
    return new ApiResult<>(true, message, null);
  }
}
