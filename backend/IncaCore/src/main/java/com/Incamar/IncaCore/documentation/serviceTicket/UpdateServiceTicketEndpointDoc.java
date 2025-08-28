package com.Incamar.IncaCore.documentation.serviceTicket;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for PUT /api/boleta-servicio/{id}.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Actualizar boleta de servicio",
        description = """
        Actualiza la información de una boleta de servicio existente identificada por su ID. \
        Accesible solo para usuarios autorizados con rol <strong>ADMIN,SUPERVISOR.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Boleta de servicio actualizada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "success": true,
                          "message": "Boleta de servicio actualizada correctamente.",
                          "data": {
                            "id": 15,
                            "travelNro": 125,
                            "travelDate": "20-08-2025",
                            "vesselAttended": "Coral Star",
                            "solicitedBy": "Oceanic S.A.",
                            "reportTravelNro": "AAA-05-0125",
                            "boatName": "Libertad"
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
                          "details": "travelDate: formato inválido, se esperaba dd-MM-AAAA",
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
                          "errorCode": "AUTH_ERROR",
                          "details": "...",
                          "path": "/api/boleta-servicio/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado: el rol del usuario no tiene permisos para modificar",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 403,
                          "message": "Acceso denegado",
                          "errorCode": "FORBIDDEN",
                          "details": "Se requiere rol ADMIN, PATRON o SUPERVISOR",
                          "path": "/api/boleta-servicio/{id}"
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
                          "message": "Boleta de servicio no encontrada con id: 15",
                          "errorCode": "NOT_FOUND",
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
                          "details": "NullPointerException ...",
                          "path": "/api/boleta-servicio/{id}"
                        }
                        """)
                )
        )
})
public @interface UpdateServiceTicketEndpointDoc {}


