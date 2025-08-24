package com.Incamar.IncaCore.documentation.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Documentación Swagger para POST /api/auth/change-password.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Cambiar contraseña",
        description = """
         Permite al usuario autenticado cambiar su contraseña.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Contraseña cambiada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "success": true,
                                      "message": "Contraseña cambiada correctamente",
                                      "data": { "token": "eyJhbGci..." }
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: contraseña actual incorrecta o error de validación",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Contraseña actual incorrecta",
                                        summary = "Cuando la contraseña actual no coincide",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "La contraseña actual es incorrecta",
                                              "errorCode": "INVALID_PASSWORD",
                                              "details": [],
                                              "path": "/api/auth/change-password"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Error de validación",
                                        summary = "Cuando faltan campos obligatorios o tienen formato incorrecto",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Falló la validación de los campos",
                                              "errorCode": "VALIDATION_ERROR",
                                              "details": [
                                                "newPassword: La nueva contraseña es requerida"
                                              ],
                                              "path": "/api/auth/change-password"
                                            }
                                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado o token inválido",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "statusCode": 401,
                                      "errorCode": "AUTH_ERROR",
                                      "message": "Acceso no autorizado. Token inválido o ausente.",
                                      "details": [],
                                      "path": "/api/auth/change-password"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error interno del servidor",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "statusCode": 500,
                                      "message": "Ocurrió un error interno en el servidor",
                                      "errorCode": "INTERNAL_ERROR",
                                      "details": ["java.lang.NullPointerException: ..."],
                                      "path": "/api/auth/change-password"
                                    }
                                """
                        )
                )
        )
})
public @interface ChangePasswordEndpointDoc {
}