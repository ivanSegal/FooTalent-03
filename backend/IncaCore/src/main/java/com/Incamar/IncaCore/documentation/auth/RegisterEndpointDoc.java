package com.Incamar.IncaCore.documentation.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Swagger documentation for POST /auth/register.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Registrar nuevo usuario",
        description = """
         Registra un nuevo usuario con el rol especificado. \s
         Devuelve un token JWT en el header <code>Authorization</code> y en el cuerpo \
         luego de un registro exitoso.
        \s"""
)
@ApiResponses(
        value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Registro exitoso",
                        content =
                        @Content(
                                mediaType = "application/json",
                                schema =
                                @Schema(
                                        example =
                                                """
                                                    {
                                                      "success": true,
                                                      "message": "Registro exitoso",
                                                      "data": { "token": "eyJhbGci..." }
                                                    }
                                                    """))),

                @ApiResponse(
                        responseCode = "400",
                        description = "Solicitud inválida: credenciales incorrectas o error de validación",
                        content = @Content(
                                mediaType = "application/json",
                                examples = {
                                        @ExampleObject(
                                                name = "Contraseña y la confirmacion de contraseña no coinciden.",
                                                summary = "Cuando las contraseñas no coinciden.",
                                                value = """
                                {
                                  "statusCode": 400,
                                  "message": "Contraseña y la confirmacion \
                                  de contraseña no coinciden.",
                                  "errorCode": "BAD_REQUEST",
                                  "details": "...",
                                  "path": "/auth/login"
                                }
                            """
                                        ),
                                        @ExampleObject(
                                                name = "Error de validación",
                                                summary = "Cuando faltan campos obligatorios o no cumplen formato",
                                                value = """
                                {
                                  "statusCode": 400,
                                  "message": "El email no puede estar vacío.",
                                  "errorCode": "VALIDATION_ERROR",
                                  "details": "...",
                                  "path": "/auth/login"
                                }
                            """
                                        )
                                }
                        )
                ),
                @ApiResponse(
                        responseCode = "409",
                        description = "Email ya registrado",
                        content =
                        @Content(
                                mediaType = "application/json",
                                schema =
                                @Schema(
                                        example =
                                                """
                                                    {
                                                      "statusCode": 409,
                                                      "message": "El email ya está en uso",
                                                      "errorCode": "CONFLICT",
                                                      "details": "...",
                                                      "path": "/auth/register"
                                                    }
                                                    """))),
                @ApiResponse(
                        responseCode = "503",
                        description = "Error interno del servidor o servicio no disponible",
                        content =
                        @Content(
                                mediaType = "application/json",
                                schema =
                                @Schema(
                                        example =
                                                """
                                                    {
                                                      "statusCode": 503,
                                                      "message":
                                                        "Error al registrar el usuario",
                                                      "errorCode": "SERVICE_UNAVAILABLE",
                                                      "details": "...",
                                                      "path": "/auth/register"
                                                    }
                                                    """)))
        })

public @interface RegisterEndpointDoc {}
