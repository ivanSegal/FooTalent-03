package com.Incamar.IncaCore.documentation.activity;

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
        summary = "Buscar actividades por nombre de embarcación con paginación",
        description = """
        Retorna una lista paginada de actividades cuyo nombre de embarcación coincida parcialmente \
        (ignorando mayúsculas) con el valor proporcionado en el parámetro `nombre`. \s
        Requiere autenticación de usuarios con rol <strong>ADMIN, SUPERVISOR, OPERATOR</strong> y \
                        pertenecientes al departamento <strong>MANTENIMIENTO</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Actividades de Mantenimiento encontradas exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "content": [
                    {
                     "id": 2,
                     "maintenanceOrder": "1-Titanic II-...",
                     "activityType": "INSPECCION",
                     "vesselItemName": "Motor Principal",
                     "description": "...",
                     "inventoryMovementsId": [2]
                    },
                    {
                     "id": 2,
                     "maintenanceOrder": "1-Titanic II-...",
                     "activityType": "INSPECCION",
                     "vesselItemName": "Motor Principal",
                     "description": "...",
                     "inventoryMovementsIds": [1, 2]
                    }
                  ],
                  "pageable": {
                    "sort": {
                      "sorted": false,
                      "unsorted": true,
                      "empty": true
                    },
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
                  "sort": {
                    "sorted": false,
                    "unsorted": true,
                    "empty": true
                  },
                  "numberOfElements": 2,
                  "size": 10,
                  "number": 0,
                  "empty": false
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado por falta de permisos. Usuario con rol o departamento no autorizado.",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 403,
                  "message": "Acceso denegado",
                  "errorCode": "FORBIDDEN",
                  "details": "...",
                  "path": "/api/maintenance-activities/search"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado (token ausente o inválido).",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 401,
                  "message": "Acceso no autorizado",
                  "errorCode": "UNAUTHORIZED",
                  "details": "...",
                  "path": "/api/maintenance-activities/search"
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
                  "path": "/api/maintenance-activities/search"
                }
                """)
                )
        )
})
public @interface SearchActivitiesByVesselNameEndpointDoc {}

