package com.Incamar.IncaCore.documentation.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.*;

/**
 * Documentación Swagger para POST /api/auth/login.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Login de usuario",
        description = """
         Autentica al usuario con email y contraseña. \s
         Devuelve un token JWT en el cuerpo con estado <b>200 OK</b>.
        \s"""
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Login exitoso",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "success": true,
                                      "message": "Login exitoso",
                                      "data": { "token": "eyJhbGci..." }
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: credenciales incorrectas o error de validación",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Credenciales inválidas",
                                        summary = "Cuando el username o la contraseña son incorrectos",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Credenciales inválidas",
                                              "errorCode": "BAD_REQUEST",
                                              "details": [
                                                "username: no puede estar vacío"
                                              ],
                                              "path": "/auth/login"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Error de validación",
                                        summary = "Cuando faltan campos requeridos o tienen formato incorrecto",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Falló la validación de los campos",
                                              "errorCode": "VALIDATION_ERROR",
                                              "details": [
                                                "password: La contraseña es requerida"
                                              ],
                                              "path": "/auth/login"
                                            }
                                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "Credenciales inválidas",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "statusCode": 401,
                                      "errorCode": "BAD_CREDENTIALS",
                                      "message": "Credenciales inválidas",
                                      "details": [
                                        "El nombre de usuario o la contraseña son incorrectos."
                                      ],
                                      "path": "/auth/login"
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
                                      "path": "/api/auth/login"
                                    }
                                """
                        )
                )
        )
})
public @interface LoginEndpointDoc {
}
