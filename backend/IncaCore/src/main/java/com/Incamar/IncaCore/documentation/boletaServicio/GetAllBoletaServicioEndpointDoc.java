package com.Incamar.IncaCore.documentation.boletaServicio;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/boleta-servicio
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todas las boletas de servicio",
        description = """
        Retorna una lista paginada de boletas de servicio registradas en el sistema. \
        Accesible para usuarios con roles: <strong>ADMIN, ADMINISTRATIVO, PATRON o SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de boletas de servicio obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "content": [
                    {
                      "id": 12,
                      "travelNro": 123,
                      "travelDate": "18-08-2025",
                      "vesselAttended": "Varada Blessing",
                      "solicitedBy": "Kronos",
                      "reportTravelNro": "AAA-05-0123",
                      "code": "COD-AB12",
                      "checkingNro": 987,
                      "boatName": "Atlántida",
                      "responsibleUsername": "a.garcia"
                    },
                    {
                      "id": 13,
                      "travelNro": 124,
                      "travelDate": "19-08-2025",
                      "vesselAttended": "Orca IX",
                      "solicitedBy": "Poseidon Ltd.",
                      "reportTravelNro": "AAA-05-0124",
                      "code": "COD-XY34",
                      "checkingNro": 988,
                      "boatName": "Marinera",
                      "responsibleUsername": "l.martinez"
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
                  "path": "/api/boleta-servicio"
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
                  "path": "/api/boleta-servicio"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Recurso no encontrado (aplica si no hay boletas registradas)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "No se encontraron boletas de servicio registradas.",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/boleta-servicio"
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
                  "path": "/api/boleta-servicio"
                }
            """)
                )
        )
})
public @interface GetAllBoletaServicioEndpointDoc {}
