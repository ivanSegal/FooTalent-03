package com.Incamar.IncaCore.documentation.boletaServicio;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/boleta-servicio/{id}.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener boleta de servicio por ID",
        description = """
        Devuelve los detalles de una boleta de servicio específica mediante su ID. \
        Accesible para usuarios con roles: <strong>ADMIN, ADMINISTRATIVO, PATRON o SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Boleta de servicio encontrada exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Boleta de servicio encontrada exitosamente.",
                  "data": {
                    "id": 15,
                    "travelNro": 125,
                    "travelDate": "20-08-2025",
                    "vesselAttended": "Coral Star",
                    "solicitedBy": "Oceanic S.A.",
                    "reportTravelNro": "AAA-05-0125",
                    "code": "COD-ZQ45",
                    "checkingNro": 990,
                    "boatName": "Libertad",
                    "responsibleUsername": "j.perez"
                  }
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Boleta de servicio no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "Boleta de servicio no encontrada con ID: ...",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/boleta-servicio/{id}"
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
                  "path": "/api/boleta-servicio/{id}"
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
                  "path": "/api/boleta-servicio/{id}"
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
                  "path": "/api/boleta-servicio/{id}"
                }
                """)
                )
        )
})
public @interface GetBoletaServicioByIdEndpointDoc {}

