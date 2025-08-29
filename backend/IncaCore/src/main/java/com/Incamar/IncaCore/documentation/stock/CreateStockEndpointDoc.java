package com.Incamar.IncaCore.documentation.stock;


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
        summary = "Crear un stock para un ítem en un almacén",
        description = """
        Crea un registro de stock asociado a un ítem en un almacén específico. \
        El par <strong>almacén + ítem</strong> debe ser único en el sistema. \
        Además, tanto el ID del almacén como el ID del ítem de almacén deben existir previamente. \
        Requiere autenticación de usuarios con rol <strong>ADMIN</strong> o bien <strong>SUPERVISOR/OPERATOR</strong> del departamento INVENTORY.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Stock creado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Stock creado correctamente.",
                      "data": {
                        "id": 10,
                        "stock": 500,
                        "stockMin": 50,
                        "warehouseId": 2,
                        "warehouseName": "Depósito Central",
                        "itemWarehouseId": 1,
                        "itemWarehouseName": "Tornillos de acero"
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
                                              "detailsError": "stock: debe ser mayor que 0, stockMin: debe ser >= 0",
                                              "path": "/api/stocks/create"
                                            }
                                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "El almacén o ítem especificado no existe",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 404,
                      "message": "Almacen no encontrado con ID: 99",
                      "errorCode": "RESOURCE_NOT_FOUND",
                      "detailsError": "...",
                      "path": "/api/stocks/create"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "409",
                description = "Ya existe un stock para ese ítem en ese almacén",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 409,
                      "message": "Ya existe un stock para ese ítem en ese almacén",
                      "errorCode": "CONFLICT",
                      "detailsError": "...",
                      "path": "/api/stocks/create"
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
                      "path": "/api/stocks/create"
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
                      "path": "/api/stocks/create"
                    }
                """
                        )
                )
        )
})
public @interface CreateStockEndpointDoc {
}
