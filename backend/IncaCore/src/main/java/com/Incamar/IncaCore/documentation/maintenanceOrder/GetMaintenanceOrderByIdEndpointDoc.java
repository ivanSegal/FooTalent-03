package com.Incamar.IncaCore.documentation.maintenanceOrder;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/ordenes-mantenimiento/{id}.
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener orden de mantenimiento por ID",
        description = """
        Devuelve los detalles de una orden de mantenimiento específica mediante su ID. \s
        Accesible para usuarios con roles: <strong>ADMIN, SUPERVISOR o OPERADOR</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Orden de Mantenimiento encontrada exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Orden de Mantenimiento encontrada exitosamente.",
                  "data": {
                     "id": 2,
                     "vesselName": "Marinera",
                     "maintenanceType": "PREVENTIVO",
                     "status": "SOLICITADO",
                     "maintenanceManager": "Juan Perez",
                     "maintenanceReason": "...",
                     "issuedAt":"...",
                     "scheduledAt":"...",
                     "startedAt":"...",
                     "finishedAt":"...",
                  }
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
                  "message": "Orden de Mantenimiento no encontrada con ID: ...",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/ordenes-mantenimiento/{id}"
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
                  "path": "/api/ordenes-mantenimiento/{id}"
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
                  "errorCode": "UNAUTHORIZED",
                  "details": "...",
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
                  "details": "...",
                  "path": "/api/ordenes-mantenimiento/{id}"
                }
            """)
                )
        )
})
public @interface GetMaintenanceOrderByIdEndpointDoc {}
