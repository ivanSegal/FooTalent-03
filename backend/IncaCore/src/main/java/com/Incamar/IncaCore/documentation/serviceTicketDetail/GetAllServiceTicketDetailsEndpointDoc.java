package com.Incamar.IncaCore.documentation.serviceTicketDetail;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/boleta-servicio-detalle
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todos los detalles de boletas de servicio",
        description = """
        Retorna una lista paginada de los detalles cargados en boletas de servicio registradas en el sistema. \
        Accesible para usuarios con roles: <strong>ADMIN, OPERATOR, SUPERVISOR</strong> y acceso al departamento VESSELS.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de los detalles de boletas de servicio obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "content": [
                    {
                      "id": 101,
                      "serviceTicketId": 12,
                      "serviceArea": "Bahía de Pozuelos",
                      "serviceType": "Traslado de materiales",
                      "description": "Servicio de traslado de materiales prestado a Kronos.",
                      "hoursTraveled": 6,
                      "patronFullName": "Juan Pérez",
                      "marinerFullName": "Mario Sosa",
                      "captainFullName": "Carlos Fernández"
                    },
                    {
                      "id": 102,
                      "serviceTicketId": 13,
                      "serviceArea": "Puerto de Ensenada",
                      "serviceType": "Transporte de personal",
                      "description": "Traslado de tripulación desde puerto a embarcación.",
                      "hoursTraveled": 4,
                      "patronFullName": "Ana Gómez",
                      "marinerFullName": "Luis Ramírez",
                      "captainFullName": "Ricardo Torres"
                    }
                  ],
                  "pageable": {
                    "sort": { "sorted": false, "unsorted": true, "empty": true },
                    "pageNumber": 0,
                    "pageSize": 10,
                    "offset": 0,
                    "paged": true,
                    "unpaged": false
                  },
                  "totalElements": 2,
                  "totalPages": 1,
                  "last": true,
                  "first": true,
                  "sort": { "sorted": false, "unsorted": true, "empty": true },
                  "numberOfElements": 2,
                  "size": 10,
                  "number": 0,
                  "empty": false
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
                  "path": "/api/boleta-servicio-detalle"
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
                  "path": "/api/boleta-servicio-detalle"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Recurso no encontrado (aplica si no hay detalles registrados)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "No se encontraron detalles de boletas de servicio registradas.",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/boleta-servicio-detalle"
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
                  "path": "/api/boleta-servicio-detalle"
                }
            """)
                )
        )
})
public @interface GetAllServiceTicketDetailsEndpointDoc {}

