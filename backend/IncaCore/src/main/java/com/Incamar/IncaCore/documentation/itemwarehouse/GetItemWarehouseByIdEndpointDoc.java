package com.Incamar.IncaCore.documentation.itemwarehouse;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener ítem de almacén por ID",
        description = "Recupera la información de un ítem de almacén existente mediante su identificador único."
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Ítem de almacén obtenido exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 200,
                  "message": "Item de almacen obtenido exitosamente.",
                  "data": {
                    "id": 10,
                    "name": "Tornillos de acero",
                    "description": "Caja con 100 tornillos de 5cm",
                    "stock": 500,
                    "stockMin": 50,
                    "warehouseName":  "Depósito Central"
                  },
                  "path": "/api/items-warehouse/{id}"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Ítem de almacén no encontrado con el ID proporcionado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "Item de almacen no encontrado con ID: 99",
                  "errorCode": "RESOURCE_NOT_FOUND",
                  "details": "...",
                  "path": "/api/items-warehouse/{id}"
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
                  "path": "/api/items-warehouse/{id}"
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
                  "path": "/api/items-warehouse/{id}"
                }
            """)
                )
        )
})
public @interface GetItemWarehouseByIdEndpointDoc {
}
