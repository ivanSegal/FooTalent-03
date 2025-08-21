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
 * Swagger documentation for POST /auth/register.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Registrar nuevo usuario",
        description = """
        Crea un nuevo usuario con el rol especificado. Si el rol es diferente a <b>ADMIN</b> se tendra que añadir un departamento <b>(INVENTORY, MAINTENANCE, VESSEL)</b> \s
        Esta operación requiere que el solicitante esté autenticado y tenga el rol <code>ADMIN</code>. \s
        Las credenciales de acceso se enviarán automáticamente al correo electronico asociado al usuario creado. \s
        """,
        security = @SecurityRequirement(name = "bearer-key")
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
                                                  "data": {null}
                                                }
                                                """
                                )
                        )
                ),
                @ApiResponse(
                        responseCode = "400",
                        description = "Solicitud inválida: error de validación o datos incorrectos",
                        content = @Content(
                                mediaType = "application/json",
                                examples = {
                                        @ExampleObject(
                                                name = "Contraseña y confirmación no coinciden",
                                                summary = "Cuando las contraseñas no coinciden",
                                                value = """
                                                {
                                                  "statusCode": 400,
                                                  "message": "Contraseña y la confirmación de contraseña no coinciden.",
                                                  "errorCode": "BAD_REQUEST",
                                                  "details": ["Las contraseñas deben ser iguales."],
                                                  "path": "/api/auth/register"
                                                }
                                                """
                                        ),
                                        @ExampleObject(
                                                name = "Error de validación",
                                                summary = "Cuando faltan campos obligatorios o no cumplen formato",
                                                value = """
                                                {
                                                  "statusCode": 400,
                                                  "message": "Falló la validación de los campos",
                                                  "errorCode": "VALIDATION_ERROR",
                                                  "details": ["email: no puede estar vacío."],
                                                  "path": "/api/auth/register"
                                                }
                                                """
                                        )
                                }
                        )
                ),
                @ApiResponse(
                        responseCode = "401",
                        description = "No autorizado: token inválido o ausente",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(
                                        example = """
                                        {
                                          "statusCode": 401,
                                          "errorCode": "UNAUTHORIZED",
                                          "message": "No autorizado. Token inválido o ausente.",
                                          "details": [],
                                          "path": "/api/auth/register"
                                        }
                                        """
                                )
                        )
                ),
                @ApiResponse(
                        responseCode = "403",
                        description = "Prohibido: rol insuficiente para realizar la operación",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(
                                        example = """
                                        {
                                          "statusCode": 403,
                                          "errorCode": "FORBIDDEN",
                                          "message": "Acceso denegado. No tiene permisos para realizar esta acción.",
                                          "details": [],
                                          "path": "/api/auth/register"
                                        }
                                        """
                                )
                        )
                ),
                @ApiResponse(
                        responseCode = "409",
                        description = "Conflicto: email o usuario ya registrado",
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
                                                  "details": ["email: usuario@dominio.com ya registrado."],
                                                  "path": "/api/auth/register"
                                                }
                                                """
                                )
                        )
                ),
                @ApiResponse(
                        responseCode = "500",
                        description = "Error interno del servidor o servicio no disponible",
                        content =
                        @Content(
                                mediaType = "application/json",
                                schema =
                                @Schema(
                                        example =
                                                """
                                                {
                                                  "statusCode": 500,
                                                  "message": "Error al registrar el usuario",
                                                  "errorCode": "SERVICE_UNAVAILABLE",
                                                  "details": ["Error inesperado en el servidor."],
                                                  "path": "/api/auth/register"
                                                }
                                                """
                                )
                        )
                )
        }
)
public @interface RegisterEndpointDoc {}
