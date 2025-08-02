package com.Incamar.IncaCore.documentation.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.*;

/**
 * Swagger documentation for POST /auth/login.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Login de usuario",
        description = """
         Autentica al usuario con nombre de usuario y contraseña. \s
         Devuelve un token JWT en el header <code>Authorization</code> y en el cuerpo con estado <b>200 OK</b>.
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
                                              "detailsError": "...",
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
                                              "message": "Error validation with data",
                                              "errorCode": "VALIDATION_ERROR",
                                              "detailsError": "username: no puede estar vacío",
                                              "path": "/auth/login"
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
                                      "message": "Usuario no encontrado",
                                      "errorCode": "NOT_FOUND",
                                      "detailsError": "...",
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
                                      "message": "Internal Error Server",
                                      "errorCode": "INTERNAL_ERROR",
                                      "detailsError": "...",
                                      "path": "/auth/login"
                                    }
                                """
                        )
                )
        )
})
public @interface LoginEndpointDoc {
}
