package com.Incamar.IncaCore.documentation.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.*;

/**
 * Documentación Swagger para POST /api/auth/reset-password.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Restablecer contraseña",
        description = """
         Permite establecer una nueva contraseña usando un token de recuperación previamente enviado por correo.
         Este token es de un solo uso y expira tras un tiempo definido.
        """
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Contraseña restablecida correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "success": true,
                                      "message": "Contraseña restablecida correctamente"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: token inválido, expirado o datos incompletos",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Token inválido o expirado",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "errorCode": "INVALID_TOKEN",
                                              "message": "El token de recuperación es inválido o ha expirado",
                                              "details": [],
                                              "path": "/api/auth/reset-password"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Error de validación",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "errorCode": "VALIDATION_ERROR",
                                              "message": "Falló la validación de los campos",
                                              "details": [
                                                "newPassword: La contraseña es requerida"
                                              ],
                                              "path": "/api/auth/reset-password"
                                            }
                                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Usuario no encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "statusCode": 404,
                                      "errorCode": "USER_NOT_FOUND",
                                      "message": "Usuario no encontrado",
                                      "details": [],
                                      "path": "/api/auth/reset-password"
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
                                      "errorCode": "INTERNAL_ERROR",
                                      "message": "Ocurrió un error interno en el servidor",
                                      "details": [
                                        "java.lang.NullPointerException: ..."
                                      ],
                                      "path": "/api/auth/reset-password"
                                    }
                                """
                        )
                )
        )
})
public @interface ResetPasswordEndpointDoc {
}
