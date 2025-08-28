package com.Incamar.IncaCore.documentation.stock;


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
        summary = "Obtener stock por ID",
        description = """
                Recupera la información de un stock existente mediante su identificador único. \
                Accesible para usuarios con roles: <strong>OPERATOR, SUPERVISOR o ADMIN</strong> en el departamento INVENTORY.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Stock obtenido exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 200,
                  "message": "Stock obtenido exitosamente.",
                  "data": {
                    "id": 15,
                    "stock": 500,
                    "stockMin": 50,
                    "warehouseId": 2,
                    "warehouseName": "Depósito Central",
                    "itemWarehouseId": 1,
                    "itemWarehouseName": "Tornillos de acero"
                  },
                  "path": "/api/stocks/{id}"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Stock no encontrado con el ID proporcionado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "message": "Stock no encontrado con ID: 99",
                  "errorCode": "RESOURCE_NOT_FOUND",
                  "details": "...",
                  "path": "/api/stocks/{id}"
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
                  "path": "/api/stocks/{id}"
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
                  "path": "/api/stocks/{id}"
                }
            """)
                )
        )
})
public @interface GetStockByIdEndpointDoc {
}
