package com.Incamar.IncaCore.documentation.embarcacion;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/embarcaciones.
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todas las embarcaciones",
        description = """
        Retorna una lista completa de embarcaciones registradas en el sistema. \
        Accesible para usuarios con roles: <strong>WAREHOUSE_STAFF, OPERATIONS_MANAGER, o ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearerAuth")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de embarcaciones obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "content": [
                    {
                      "id": 1,
                      "nombre": "Embarcación A",
                      "nPatente": "ABC123",
                      "modelo": "Modelo 2023",
                      "capitan": "Juan Pérez"
                    },
                    {
                      "id": 2,
                      "nombre": "Embarcación B",
                      "nPatente": "DEF456",
                      "modelo": "Modelo 2022",
                      "capitan": "María López"
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
                  "path": "/api/embarcaciones"
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
                  "path": "/api/embarcaciones"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Recurso no encontrado (en este contexto podría aplicarse si no hay embarcaciones registradas)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "No se encontraron embarcaciones registradas.",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/embarcaciones"
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
                  "path": "/api/embarcaciones"
                }
            """)
                )
        )
})
public @interface GetAllEmbarcacionesEndpointDoc {}

