package com.Incamar.IncaCore.documentation.itemwarehouse;

import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for PUT /api/item-warehouses/{id}.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Actualizar ítem de almacén",
        description = """
        Actualiza el nombre y la descripción de un ítem existente dentro de un almacén identificado por su ID único. \
        Solo usuarios con rol <strong>ADMIN</strong> o <strong>SUPERVISOR</strong> del departamento INVENTORY pueden realizar esta operación.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Ítem de almacén actualizado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = ItemWarehouseResponseDto.class),
                        examples = {
                                @io.swagger.v3.oas.annotations.media.ExampleObject(
                                        name = "Item actualizado con stocks",
                                        summary = "Respuesta con ítem de almacén actualizado y lista de stocks",
                                        value = """
                                {
                                  "success": true,
                                  "message": "Item de almacen editado exitosamente.",
                                  "data": {
                                    "id": 1,
                                    "name": "Tornillos de acero",
                                    "description": "Caja con 100 tornillos de 5cm",
                                    "stocks": [
                                      {
                                        "stockId": 1,
                                        "stock": 35,
                                        "stockMin": 20,
                                        "warehouseId": 1,
                                        "warehouseName": "Depósito Central"
                                      },
                                      {
                                        "stockId": 2,
                                        "stock": 170,
                                        "stockMin": 20,
                                        "warehouseId": 2,
                                        "warehouseName": "Depósito Norte"
                                      }
                                    ]
                                  }
                                }
                                """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: datos malformados o violaciones de validación",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 400,
                          "message": "Error de validación",
                          "errorCode": "VALIDATION_ERROR",
                          "details": "name: no puede estar vacío",
                          "path": "/api/item-warehouses/{id}"
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
                          "details": "El usuario no tiene permisos para editar ítems de almacén",
                          "path": "/api/item-warehouses/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Ítem de almacén no encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Item de almacen no encontrado con ID: {id}",
                          "errorCode": "RESOURCE_NOT_FOUND",
                          "details": "No existe un ítem con el ID proporcionado",
                          "path": "/api/item-warehouses/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "409",
                description = "Conflicto: ya existe un ítem con el mismo nombre",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 409,
                          "message": "Item de almacen ya existe con ese nombre.",
                          "errorCode": "CONFLICT_ERROR",
                          "details": "No se puede actualizar porque ya existe un ítem con ese nombre",
                          "path": "/api/item-warehouses/{id}"
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
                          "details": "NullPointerException at line ...",
                          "path": "/api/item-warehouses/{id}"
                        }
                        """)
                )
        )
})
public @interface UpdateItemWarehouseEndpointDoc {
}
