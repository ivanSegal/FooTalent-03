package com.Incamar.IncaCore.documentation.vesselItemHours;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todas las boletas de horas añadidas a componentes de embarcación",
        description = """
        Retorna una lista completa de la boleta de horas registradas de los componentes de embarcación en el sistema.  \
        Accesible para usuarios con roles: <strong>ADMIN, OPERATOR, o SUPERVISOR.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de la boleta de horas registrada de componentes de embarcaciones obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Se visualizan exitosamente todas las boletas de registro de horas por componentes de embarcación.",
                  "data": {
                    "content": [
                      {
                          "id": 1,
                          "responsable": "Juan Pérez",
                          "vesselId": 1,
                          "date": "2025-08-25",
                          "items": [
                            {
                              "vesselItemId": 1,
                              "addedHours": 0
                            }
                          ]
                      }...
                    ],
                    "pageable": {
                      "pageNumber": 0,
                      "pageSize": 20,
                      "sort": {
                        "empty": true,
                        "unsorted": true,
                        "sorted": false
                      },
                      "offset": 0,
                      "paged": true,
                      "unpaged": false
                    },
                    "last": true,
                    "totalElements": 2,
                    "totalPages": 1,
                    "size": 20,
                    "number": 0,
                    "sort": {
                      "empty": true,
                      "unsorted": true,
                      "sorted": false
                    },
                    "first": true,
                    "numberOfElements": 2,
                    "empty": false
                  }
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
                  "path": "/api/vessel-item-hours"
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
                  "path": "/api/vessel-item-hours"
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
                  "path": "/api/vessel-item-hours"
                }
                """)
                )
        )
})

public @interface GetAllVesselItemHoursEndpointDoc {}
