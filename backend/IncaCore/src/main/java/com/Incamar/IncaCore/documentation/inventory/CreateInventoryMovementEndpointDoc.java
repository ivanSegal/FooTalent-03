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
        summary = "Crear un movimiento de inventario",
        description = """
        Registra un nuevo movimiento de inventario (ENTRADA o SALIDA) para un ítem específico en un almacén. \
        Actualiza automáticamente el stock del ítem y registra al usuario responsable. \
        Requiere autenticación de usuarios con rol <strong>ADMIN</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Movimiento de inventario creado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Movimiento de inventario creado correctamente.",
                      "data": {
                        "id": 10,
                        "itemWarehouseId": 1,
                        "itemWarehouseName": "Tornillos de acero",
                        "movementType": "ENTRADA",
                        "quantity": 50,
                        "date": "2025-08-26",
                        "reason": "Reposición de stock",
                        "responsibleId": 5,
                        "responsibleName": "Jose Gonzales"
                      }
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Error de validación en los datos de entrada",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Campos inválidos",
                                        summary = "Cuando faltan datos o tienen formato incorrecto",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Error de validación en los datos",
                                              "errorCode": "VALIDATION_ERROR",
                                              "detailsError": "quantity: debe ser mayor que 0, reason: no puede estar vacío",
                                              "path": "/api/inventory-movements/create"
                                            }
                                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "El ítem o usuario responsable no existe",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 404,
                      "message": "Item de almacen o usuario no encontrado",
                      "errorCode": "RESOURCE_NOT_FOUND",
                      "detailsError": "...",
                      "path": "/api/inventory-movements/create"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "409",
                description = "Stock insuficiente para el movimiento de salida",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 409,
                      "message": "Stock insuficiente para el ítem con ID: 1",
                      "errorCode": "CONFLICT",
                      "detailsError": "...",
                      "path": "/api/inventory-movements/create"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado (token ausente o inválido)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 401,
                      "message": "Acceso no autorizado",
                      "errorCode": "AUTH_ERROR",
                      "details": "...",
                      "path": "/error"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado por falta de permisos",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 403,
                      "message": "Acceso denegado",
                      "errorCode": "FORBIDDEN",
                      "details": "...",
                      "path": "/api/inventory-movements/create"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error interno del servidor",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 500,
                      "message": "Internal Server Error",
                      "errorCode": "INTERNAL_ERROR",
                      "detailsError": "...",
                      "path": "/api/inventory-movements/create"
                    }
                """
                        )
                )
        )
})
public @interface CreateInventoryMovementEndpointDoc {
}
