package com.Incamar.IncaCore.documentation.serviceTicketDetail;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/boleta-servicio-detalle/by-ticket/{ticketId}
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener detalle de boleta de servicio por ServiceTicket ID",
        description = """
        Devuelve el detalle asociado a un ServiceTicket específico mediante su ID. \
        Cada ServiceTicket puede tener **solo un detalle** (relación 1–1).<br/><br/>
        Accesible para usuarios con roles: <strong>ADMIN, OPERATOR, SUPERVISOR</strong> \
        con acceso al departamento VESSELS.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Detalle de boleta de servicio encontrado exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Detalle de boleta de servicio encontrado exitosamente.",
                  "data": {
                    "id": 201,
                    "serviceTicketId": 42,
                    "serviceArea": "Bahía de Pozuelos",
                    "serviceType": "Traslado de materiales",
                    "description": "Traslado de materiales a la base offshore.",
                    "hoursTraveled": 8,
                    "patronFullName": "Juan Pérez",
                    "marinerFullName": "Mario Sosa",
                    "captainFullName": "Carlos Fernández"
                  }
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Detalle de boleta de servicio no encontrado para el ServiceTicket dado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "No existe detalle para ServiceTicket con id: {ticketId}",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/boleta-servicio-detalle/by-ticket/{ticketId}"
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
                  "path": "/api/boleta-servicio-detalle/by-ticket/{ticketId}"
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
                  "path": "/api/boleta-servicio-detalle/by-ticket/{ticketId}"
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
                  "path": "/api/boleta-servicio-detalle/by-ticket/{ticketId}"
                }
            """)
                )
        )
})
public @interface GetByServiceTicketIdEndpointDoc {}
