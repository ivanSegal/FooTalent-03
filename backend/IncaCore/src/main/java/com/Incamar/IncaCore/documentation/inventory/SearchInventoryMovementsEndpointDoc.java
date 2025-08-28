package com.Incamar.IncaCore.documentation.inventory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/inventory-movements/search.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Buscar movimientos de inventario por nombre de ítem de almacén",
        description = """
        Retorna una lista paginada de movimientos de inventario cuyo nombre del ítem de almacén coincida \
        parcialmente con el valor proporcionado (ignorando mayúsculas). \
        Accesible para usuarios con roles: <strong>OPERATOR, SUPERVISOR o ADMIN</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Movimientos de inventario obtenidos exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Movimientos de inventario obtenidos exitosamente.",
                  "data": {
                    "content": [
                      {
                        "id": 1,
                        "itemWarehouseId": 10,
                        "itemWarehouseName": "Tornillos de acero",
                        "movementType": "ENTRADA",
                        "quantity": 100,
                        "date": "2025-08-26",
                        "reason": "Reposición de stock",
                        "responsibleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        "responsibleName": "Claudia Ramos"
                      },
                      {
                        "id": 2,
                        "itemWarehouseId": 11,
                        "itemWarehouseName": "Tornillos de acero M5",
                        "movementType": "SALIDA",
                        "quantity": 50,
                        "date": "2025-08-25",
                        "reason": "Pedido de cliente",
                        "responsibleId": "3fa85f64-5717-4562-b3fc-2c963f66af46",
                        "responsibleName": "Juan Pérez"
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
                responseCode = "403",
                description = "Acceso denegado por falta de permisos. Usuario con rol no autorizado.",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 403,
                  "message": "Acceso denegado",
                  "errorCode": "FORBIDDEN",
                  "details": "El usuario no tiene permisos para buscar movimientos de inventario",
                  "path": "/api/inventory-movements/search"
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
                  "path": "/api/inventory-movements/search"
                }
                """)
                )
        )
})
public @interface SearchInventoryMovementsEndpointDoc {
}
