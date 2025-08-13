package com.Incamar.IncaCore.documentation.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.*;

/**
 * Documentación Swagger para POST /api/auth/forgot-password.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Recuperar contraseña",
        description = """
         Solicita el envío de un correo para restablecer la contraseña de un usuario registrado. \s
         Es necesario proporcionar el nombre de usuario válido asociado a una cuenta con correo electrónico registrado.\s
         Si el usuario no tiene correo asociado, se indicará que contacte al administrador.
        """
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Correo de recuperación enviado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "success": true,
                                      "message": "Se ha enviado un correo para restablecer tu contraseña"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida o error de validación",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Usuario no encontrado",
                                        summary = "Cuando el nombre de usuario no existe",
                                        value = """
                                            {
                                              "statusCode": 404,
                                              "message": "Usuario no encontrado",
                                              "errorCode": "NOT_FOUND",
                                              "details": [],
                                              "path": "/api/auth/forgot-password"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Sin correo asociado",
                                        summary = "Cuando el usuario no tiene correo asociado para recuperación",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "El usuario no cuenta con un correo asociado, contacte al administrador",
                                              "errorCode": "BAD_REQUEST",
                                              "details": [],
                                              "path": "/api/auth/forgot-password"
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
                                                "username: no puede estar vacío"
                                              ],
                                              "path": "/api/auth/forgot-password"
                                            }
                                        """
                                )
                        }
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
                                      "path": "/api/auth/forgot-password"
                                    }
                                """
                        )
                )
        )
})
public @interface ForgotPasswordEndpointDoc {
}
