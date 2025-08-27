package com.Incamar.IncaCore.documentation.itemwarehouse;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/item-warehouses.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todos los ítems de almacén",
        description = """
        Retorna una lista paginada de ítems de almacén registrados en el sistema. \
        Accesible para usuarios con roles: <strong>WAREHOUSE_STAFF, OPERATIONS_MANAGER o ADMIN</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de ítems de almacén obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Se visualizan exitosamente todos los items de almacen.",
                  "data": {
                    "content": [
                      {
                        "id": 1,
                        "name": "Tornillos de acero",
                        "description": "Caja con 100 tornillos de 5cm",
                        "stock": 150,
                        "stockMin": 20,
                        "warehouseName": "Depósito Central"
                      },
                      {
                        "id": 2,
                        "name": "Tuercas M5",
                        "description": "Bolsa con 200 tuercas",
                        "stock": 300,
                        "stockMin": 50,
                        "warehouseName": "Almacén Norte"
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
                          "details": "El usuario no tiene permisos para visualizar ítems de almacén",
                          "path": "/api/item-warehouses"
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
                          "path": "/api/item-warehouses"
                        }
                        """)
                )
        )
})
public @interface GetAllItemWarehousesEndpointDoc {
}
