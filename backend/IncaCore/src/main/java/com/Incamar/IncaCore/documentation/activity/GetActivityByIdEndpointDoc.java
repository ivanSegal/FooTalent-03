package com.Incamar.IncaCore.documentation.activity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/maintenance-activities/{id}.
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener actividades de mantenimiento por ID",
        description = """
        Devuelve los detalles de una actividad de mantenimiento específica mediante su ID. \s
        Accesible para usuarios con roles: <strong>ADMIN, SUPERVISOR o OPERATOR</strong> y \
                pertenecientes al departamento <strong>MANTENIMIENTO</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Actividad encontrada exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Actividad encontrada exitosamente.",
                  "data": {
                     "id": 2,
                     "maintenanceOrder": "1-Titanic II-...",
                     "activityType": "INSPECCION",
                     "vesselItemName": "Motor Principal",
                     "description": "...",
                     "inventoryMovementId": "2"
                  }
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Actividad no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "Actividad no encontrada con ID: ...",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/maintenance-activities/{id}"
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
                  "path": "/api/maintenance-activities/{id}"
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
                  "path": "/api/maintenance-activities/{id}"
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
                  "path": "/api/maintenance-activities/{id}"
                }
            """)
                )
        )
})
public @interface GetActivityByIdEndpointDoc {}
