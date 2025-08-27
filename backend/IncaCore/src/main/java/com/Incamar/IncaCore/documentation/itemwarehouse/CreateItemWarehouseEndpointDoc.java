package com.Incamar.IncaCore.documentation.itemwarehouse;

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
        summary = "Crear un ítem de almacén",
        description = """
        Crea un nuevo ítem dentro de un almacén especificando nombre, descripción, stock y stock mínimo. \
        El nombre del ítem debe ser único en el sistema. \
        Además, el ID de almacén debe existir previamente en el sistema. \
        Requiere autenticación de usuarios con rol <strong>ADMIN</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Ítem de almacén creado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Item de almacen creado correctamente.",
                      "data": {
                        "id": 1,
                        "name": "Tornillos de acero",
                        "description": "Caja con 100 tornillos de 5cm",
                        "stock": 500,
                        "stockMin": 50,
                        "warehouse": {
                          "id": 2,
                          "name": "Depósito Central"
                        }
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
                                              "detailsError": "name: no puede estar vacío, stock: debe ser mayor que 0",
                                              "path": "/api/items-warehouse/create"
                                            }
                                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "El almacén especificado no existe",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 404,
                      "message": "Almacen no encontrado con ID: 99",
                      "errorCode": "RESOURCE_NOT_FOUND",
                      "detailsError": "...",
                      "path": "/api/items-warehouse/create"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "409",
                description = "El nombre del ítem ya existe en el sistema",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 409,
                      "message": "Item de almacen ya existe con ese nombre.",
                      "errorCode": "CONFLICT",
                      "detailsError": "...",
                      "path": "/api/items-warehouse/create"
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
                      "path": "/api/items-warehouse/create"
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
                      "path": "/api/items-warehouse/create"
                    }
                """
                        )
                )
        )
})
public @interface CreateItemWarehouseEndpointDoc {
}
