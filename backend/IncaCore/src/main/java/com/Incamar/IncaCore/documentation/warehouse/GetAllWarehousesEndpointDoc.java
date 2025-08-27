package com.Incamar.IncaCore.documentation.warehouse;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/warehouses.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todos los almacenes",
        description = """
        Retorna una lista paginada de almacenes registrados en el sistema. \
        Accesible para usuarios con roles: <strong>WAREHOUSE_STAFF, OPERATIONS_MANAGER, o ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de almacenes obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Se visualizan exitosamente todos los almacenes.",
                  "data": {
                    "content": [
                      {
                        "id": 1,
                        "name": "Depósito Central",
                        "location": "Av. Libertador 1234, Buenos Aires"
                      },
                      {
                        "id": 2,
                        "name": "Almacén Norte",
                        "location": "Ruta 9, Córdoba"
                      }
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
                  "details": "Token inválido o expirado",
                  "path": "/error"
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
                  "details": "El usuario no tiene permisos para visualizar almacenes",
                  "path": "/api/warehouses"
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
                  "path": "/api/warehouses"
                }
                """)
                )
        )
})
public @interface GetAllWarehousesEndpointDoc {
}
