package com.Incamar.IncaCore.documentation.warehouse;

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
        summary = "Crear un almacén",
        description = """
        Crea un nuevo almacén especificando nombre y ubicación. \
        El nombre del almacén debe ser único en el sistema. \
        Requiere autenticación de usuarios con rol <strong>ADMIN, SUPERVISOR, OPERATOR</strong> pertenecientes al departamento INVENTORY.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Almacén creado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Almacen creado correctamente",
                      "data": {
                        "id": 1,
                        "name": "Depósito Central",
                        "location": "Av. Libertador 1234, Buenos Aires"
                      }
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: nombre duplicado o error de validación",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Nombre duplicado",
                                        summary = "Cuando el nombre del almacén ya existe",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "El nombre del almacen ya existe.",
                                              "errorCode": "BAD_REQUEST",
                                              "detailsError": "...",
                                              "path": "/api/warehouses/create"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Error de validación",
                                        summary = "Cuando faltan campos requeridos o tienen formato inválido",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Error de validación en los datos",
                                              "errorCode": "VALIDATION_ERROR",
                                              "detailsError": "name: no puede estar vacío, location: no puede estar vacío",
                                              "path": "/api/warehouses/create"
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
                      "path": "/api/warehouses/create"
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
                      "message": "Internal Error Server",
                      "errorCode": "INTERNAL_ERROR",
                      "detailsError": "...",
                      "path": "/api/warehouses/create"
                    }
                """
                        )
                )
        )
})
public @interface CreateWarehouseEndpointDoc {
}
