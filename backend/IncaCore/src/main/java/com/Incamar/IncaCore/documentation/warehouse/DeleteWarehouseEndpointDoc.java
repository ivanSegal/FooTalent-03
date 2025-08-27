package com.Incamar.IncaCore.documentation.warehouse;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;


@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Eliminar almacén",
        description = """
        Elimina un almacén existente del sistema por su ID único. \
        Solo usuarios con rol <strong>ADMIN</strong> pueden realizar esta operación.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Almacén eliminado exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Almacén eliminado exitosamente.",
                  "data": null
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
                          "details": "El usuario no tiene permisos para eliminar este almacén",
                          "path": "/api/warehouses/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Almacén no encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Almacén no encontrado con ID: {id}",
                          "errorCode": "RESOURCE_NOT_FOUND",
                          "details": "No existe un almacén con el ID proporcionado",
                          "path": "/api/warehouses/{id}"
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
                          "path": "/api/warehouses/{id}"
                        }
                        """)
                )
        )
})
public @interface DeleteWarehouseEndpointDoc {
}
