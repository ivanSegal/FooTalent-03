package com.Incamar.IncaCore.documentation.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for POST /api/users.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Crear nuevo usuario",
        description = """
        Crea un nuevo usuario en el sistema especificando nombre de usuario, contraseña, rol y fecha de creación. \
        Requiere autenticación de usuarios con rol <strong>ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Usuario creado exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Usuario creado exitosamente.",
                      "data": {
                        "username": "juan.perez_94",
                        "password": "MiContraseña123!"
                        "role": "ADMIN"
                        "createdAt": "..."
                      }
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
                                        name = "Campos requeridos faltantes",
                                        summary = "Cuando falta el campo username, password, role o createdAt",
                                        value = """
                        {
                          "statusCode": 400,
                          "message": "Error validation with data",
                          "errorCode": "VALIDATION_ERROR",
                          "detailsError": "username: no puede estar vacío",
                          "path": "/api/users"
                        }
                    """
                                ),
                                @ExampleObject(
                                        name = "Nombre de Usuario duplicado",
                                        summary = "Cuando se intenta registrar una nombre de usuario ya existente",
                                        value = """
                        {
                          "statusCode": 400,
                          "message": "El nombre de usuario ya está registrado",
                          "errorCode": "DUPLICATE_ENTRY",
                          "detailsError": "username: juan.perez_94",
                          "path": "/api/users"
                        }
                    """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado (token ausente o inválido)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 401,
                      "message": "Acceso no autorizado",
                      "errorCode": "UNAUTHORIZED",
                      "details": "...",
                      "path": "/api/users"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado por falta de permisos",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 403,
                      "message": "Acceso denegado",
                      "errorCode": "FORBIDDEN",
                      "details": "...",
                      "path": "/api/users"
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
                      "detailsError": "NullPointerException...",
                      "path": "/api/users"
                    }
                """
                        )
                )
        )
})
public @interface CreateUserEndpointDoc {}