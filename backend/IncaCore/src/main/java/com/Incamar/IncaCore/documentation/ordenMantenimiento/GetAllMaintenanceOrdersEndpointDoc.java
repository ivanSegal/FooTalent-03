package com.Incamar.IncaCore.documentation.ordenMantenimiento;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/ordenes-mantenimiento.
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todas las ordenes de mantenimiento",
        description = """
        Retorna una lista completa de ordenes de mantenimiento registradas en el sistema. \
        Accesible para usuarios con roles: <strong>WAREHOUSE_STAFF, OPERATIONS_MANAGER, o ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de ordenes de mantenimiento obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "content": [
                    {
                       "id": 1,
                       "embarcacionNombre": "Marinera",
                       "tipo_mantenimiento": "PREVENTIVO",
                       "estado": "SOLICITADO",
                       "encargadoMantenimientoUsername": "juan.perez_94",
                       "fechaEmision":"...",
                       "fechaProgramada":"...",
                       "fechaInicio":"...",
                       "fechaFin":"...",
                       "motivoMantenimiento": "...",
                    },
                    {
                       "id": 2,
                       "embarcacionNombre": "Marinera",
                       "tipoMantenimiento": "CORRECTIVO",
                       "estado": "FINALIZADO",
                       "encargadoMantenimientoUsername": "juan.perez_94",
                       "fechaEmision":"...",
                       "fechaProgramada":"...",
                       "fechaInicio":"...",
                       "fechaFin":"...",
                       "motivoMantenimiento": "...",
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
                  "path": "/api/ordenes-mantenimiento"
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
                  "path": "/api/ordenes-mantenimiento"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Recurso no encontrado (en este contexto podría aplicarse si no hay ordenes de " +
                        "mantenimiento registradas)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "No se encontraron ordenes de mantenimiento registradas.",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/ordenes-mantenimiento"
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
                  "path": "/api/ordenes-mantenimiento"
                }
            """)
                )
        )
})
public @interface GetAllMaintenanceOrdersEndpointDoc {}

