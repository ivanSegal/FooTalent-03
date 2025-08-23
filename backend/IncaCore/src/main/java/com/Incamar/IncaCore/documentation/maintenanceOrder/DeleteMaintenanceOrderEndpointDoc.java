package com.Incamar.IncaCore.documentation.maintenanceOrder;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for DELETE /api/ordenes-mantenimiento.
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Eliminar orden de mantenimiento",
        description = """
        Elimina definitivamente una orden de mantenimiento por su ID único. \s
        Requiere autenticación de usuarios con rol <strong>ADMIN</strong> y\
        pertenecientes al departamento <strong>MANTENIMIENTO</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "204",
                description = "Orden de Mantenimiento eliminada correctamente",
                content = @Content // sin body (no content)
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
                          "errorCode": "UNAUTHORIZED",
                          "details": "Token inválido o expirado",
                          "path": "/api/ordenes-mantenimiento/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado: el rol del usuario no tiene permisos para eliminar",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 403,
                          "message": "Acceso denegado",
                          "errorCode": "FORBIDDEN",
                          "details": "Se requiere rol ADMIN y ser del departamento de MANTENIMIENTO",
                          "path": "/api/ordenes-mantenimiento/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Orden de Mantenimiento no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "errorCode": "NOT_FOUND",
                          "message": "Orden de Mantenimiento no encontrada con id: {id}",
                          "details": "No existe una orden de mantenimiento con el ID proporcionado",
                          "path": "/api/ordenes-mantenimiento/{id}"
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
                          "path": "/api/ordenes-mantenimiento/{id}"
                        }
                        """)
                )
        )
})
public @interface DeleteMaintenanceOrderEndpointDoc {}