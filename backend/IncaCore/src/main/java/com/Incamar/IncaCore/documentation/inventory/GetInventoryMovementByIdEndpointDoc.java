package com.Incamar.IncaCore.documentation.inventory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

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
        summary = "Obtener movimiento de inventario por ID",
        description = """
                Recupera la información de un movimiento de inventario existente mediante su identificador único. \
                Accesible para usuarios con roles: <strong>OPERATOR, SUPERVISOR o ADMIN</strong> que pertenezcan al departamento INVENTORY.
""",
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Movimiento de inventario obtenido exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 200,
                  "message": "Movimiento de inventario obtenido exitosamente.",
                  "data": {
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
                  "path": "/api/inventory-movements/{id}"
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Movimiento de inventario no encontrado con el ID proporcionado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "Movimiento de inventario no encontrado con ID: 99",
                  "errorCode": "RESOURCE_NOT_FOUND",
                  "details": "...",
                  "path": "/api/inventory-movements/{id}"
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
                  "path": "/api/inventory-movements/{id}"
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
                  "path": "/api/inventory-movements/{id}"
                }
                """)
                )
        )
})
public @interface GetInventoryMovementByIdEndpointDoc {
}
