package com.Incamar.IncaCore.documentation.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for PUT /api/users.
 */


@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Actualizar usuario",
        description = """
        Actualiza la información de un usuario existente identificado por su ID. \
        Accesible solo para usuarios autorizados con rol <strong>ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Usuario actualizado exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "success": true,
                          "message": "Usuario actualizado exitosamente.",
                          "data": {
                            "username": "juan.perez_94",
                            "password": "MiContraseña123!"
                            "role": "ADMIN"
                            "createdAt": "..."
                          }
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: datos malformados o violaciones de validación",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 400,
                          "message": "Error de validación",
                          "errorCode": "VALIDATION_ERROR",
                          "details": "username: no puede estar vacío",
                          "path": "/api/users/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado (token ausente o inválido)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 401,
                          "message": "Acceso no autorizado",
                          "errorCode": "AUTH_ERROR",
                          "details": "...",
                          "path": "/api/users/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado por falta de permisos",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 403,
                          "message": "Acceso denegado",
                          "errorCode": "FORBIDDEN",
                          "details": "...",
                          "path": "/api/users/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Usuario no encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Usuario no encontrado con id: ...",
                          "errorCode": "NOT_FOUND",
                          "details": "...",
                          "path": "/api/users/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "409",
                description = "El nombre de usuario ingresado ya esta en uso",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 409,
                          "message": "El nombre de usuario ya está en uso",
                          "errorCode": "CONFLICT",
                          "details": "...",
                          "path": "/api/users/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error interno del servidor",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 500,
                          "message": "Error inesperado",
                          "errorCode": "INTERNAL_SERVER_ERROR",
                          "details": "NullPointerException ...",
                          "path": "/api/users/{id}"
                        }
                        """)
                )
        )
})
public @interface UpdateUserEndpointDoc {}
