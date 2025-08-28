package com.Incamar.IncaCore.documentation.stock;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for PUT /api/stocks/{id}.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Actualizar stock mínimo",
        description = """
        Actualiza la información del stock mínimo (`stockMin`) de un stock existente identificado por su ID único. \
        Solo usuarios con rol <strong>ADMIN</strong> o <strong>SUPERVISOR</strong> pertenecientes al departamento INVENTORY pueden realizar esta operación.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Stock actualizado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "success": true,
                          "message": "Stock editado exitosamente.",
                          "data": {
                            "id": 5,
                            "stock": 150,
                            "stockMin": 30,
                            "warehouseId": 1,
                            "warehouseName": "Depósito Central",
                            "itemWarehouseId": 12,
                            "itemWarehouseName": "Tornillo M6"
                          }
                        }
                        """)
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
                          "details": "stockMin: no puede ser nulo",
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
                          "details": "El usuario no tiene permisos para editar stocks",
                          "path": "/api/stocks/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Stock no encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Stock no encontrado con ID: {id}",
                          "errorCode": "RESOURCE_NOT_FOUND",
                          "details": "No existe un stock con el ID proporcionado",
                          "path": "/api/stocks/{id}"
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
                          "path": "/api/stocks/{id}"
                        }
                        """)
                )
        )
})
public @interface UpdateStockEndpointDoc {
}
