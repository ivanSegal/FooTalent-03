package com.Incamar.IncaCore.documentation.inventory;



import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;


@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todos los movimientos de inventario",
        description = """
        Retorna una lista paginada de todos los movimientos de inventario registrados en el sistema. \
        Accesible para usuarios con roles: <strong>OPERATOR, SUPERVISOR o ADMIN</strong> que pertenezcan al departamento INVENTORY.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de movimientos de inventario obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Movimientos obtenidos",
                                        summary = "Lista de movimientos con detalles de los ítems",
                                        value = """
                                        {
                                          "success": true,
                                          "message": "Se visualizan exitosamente todos los movimientos de inventario.",
                                          "data": {
                                            "content": [
                                              {
                                                "id": 44,
                                                "warehouseId": 1,
                                                "warehouseName": "Depósito Central",
                                                "movementType": "ENTRADA",
                                                "date": "2025-08-24",
                                                "reason": "Ingreso por compra de proveedor",
                                                "responsibleId": "ad1e461d-04c2-4a4c-be93-56260c2245fb",
                                                "responsibleName": "Juan Pérez",
                                                "movementDetails": [
                                                  {
                                                    "itemWarehouseId": 1,
                                                    "itemWarehouseName": "Tornillos de acero",
                                                    "quantity": 50
                                                  }
                                                ]
                                              },
                                              {
                                                "id": 45,
                                                "warehouseId": 2,
                                                "warehouseName": "Depósito Norte",
                                                "movementType": "SALIDA",
                                                "date": "2025-08-25",
                                                "reason": "Pedido de cliente",
                                                "responsibleId": "3fa85f64-5717-4562-b3fc-2c963f66af46",
                                                "responsibleName": "Claudia Ramos",
                                                "movementDetails": [
                                                  {
                                                    "itemWarehouseId": 2,
                                                    "itemWarehouseName": "Tuercas M5",
                                                    "quantity": 30
                                                  },
                                                  {
                                                    "itemWarehouseId": 3,
                                                    "itemWarehouseName": "Clavos galvanizados",
                                                    "quantity": 20
                                                  }
                                                ]
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
                                        """
                                )
                        }
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
                          "details": "El usuario no tiene permisos para visualizar movimientos de inventario",
                          "path": "/api/inventory-movements"
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
                          "path": "/api/inventory-movements"
                        }
                        """)
                )
        )
})
public @interface GetAllInventoryMovementsEndpointDoc {
}
