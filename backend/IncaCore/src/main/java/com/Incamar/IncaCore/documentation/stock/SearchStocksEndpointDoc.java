package com.Incamar.IncaCore.documentation.stock;

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
        summary = "Buscar stocks por nombre de ítem con paginación",
        description = """
        Retorna una lista paginada de stocks cuyo nombre de ítem de almacen coincida parcialmente
        (ignorando mayúsculas) con el valor proporcionado en el parámetro `nombre`.
        <strong>Accesible solo para usuarios con rol ADMIN, OPERATOR o SUPERVISOR</strong> pertenecientes al departamento INVENTORY.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Stocks encontrados exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Stocks obtenidos exitosamente.",
                  "data": {
                    "content": [
                      {
                        "id": 1,
                        "stock": 150,
                        "stockMin": 20,
                        "warehouseId": 1,
                        "warehouseName": "Depósito Central",
                        "itemWarehouseId": 10,
                        "itemWarehouseName": "Tornillo M6"
                      },
                      {
                        "id": 2,
                        "stock": 80,
                        "stockMin": 15,
                        "warehouseId": 2,
                        "warehouseName": "Almacén Norte",
                        "itemWarehouseId": 12,
                        "itemWarehouseName": "Arandela 8mm"
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
                    "last": false,
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
                responseCode = "403",
                description = "Acceso denegado por falta de permisos. Usuario con rol no autorizado.",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 403,
                  "message": "Acceso denegado",
                  "errorCode": "FORBIDDEN",
                  "details": "El usuario no tiene permisos para buscar stocks",
                  "path": "/api/stocks/search"
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
                  "errorCode": "AUTH_ERROR",
                  "details": "Token inválido o expirado",
                  "path": "/error"
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
                  "path": "/api/stocks/search"
                }
                """)
                )
        )
})
public @interface SearchStocksEndpointDoc {
}
