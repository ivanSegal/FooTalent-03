package com.Incamar.IncaCore.documentation.itemwarehouse;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Buscar ítems de almacén por nombre con paginación",
        description = """
        Retorna una lista paginada de ítems de almacén cuyo nombre coincida parcialmente
        (ignorando mayúsculas) con el valor proporcionado en el parámetro `nombre`.
        <strong>Accesible solo para usuarios con rol ADMIN, SUPERVISOR, OPERATOR.</strong> pertenecientes al departamento INVENTORY.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Ítems de almacén encontrados exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Ítems de almacén obtenidos exitosamente.",
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
                        "name": "Clavos galvanizados",
                        "description": "Bolsa con 200 clavos de 3cm",
                        "stock": 80,
                        "stockMin": 10,
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
                  "details": "El usuario no tiene permisos para buscar ítems de almacén",
                  "path": "/api/item-warehouses/search"
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
                  "path": "/api/item-warehouses/search"
                }
                """)
                )
        )
})
public @interface SearchItemWarehouseEndpointDoc {
}
