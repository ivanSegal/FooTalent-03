package com.Incamar.IncaCore.documentation.ordenMantenimiento;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for PUT /api/ordenes-mantenimiento.
 */


@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Actualizar orden de mantenimiento",
        description = """
        Actualiza la información de una orden de mantenimiento existente identificada por su ID. \
        Accesible solo para usuarios autorizados con rol <strong>ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Orden de Mantenimiento actualizada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "success": true,
                          "message": "Orden de Mantenimiento actualizada correctamente.",
                          "data": {
                            "embarcacion_id": 101,
                            "tipo_mantenimiento": "PREVENTIVO",
                            "estado": "SOLICITADO",
                            "encargadoMantenimientoUsername": "juan.perez_94",
                            "fechaEmision":"...",
                            "fechaProgramada":"...",
                            "fechaInicio":"...",
                            "fechaFin":"...",
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
                          "details": "tipo_mantenimiento: no puede estar vacío",
                          "path": "/api/ordenes-mantenimiento/{id}"
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
                          "path": "/api/ordenes-mantenimiento/{id}"
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
                          "path": "/api/ordenes-mantenimiento/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Orden de Mantenimiento no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Orden de Mantenimiento no encontrada con id: 12",
                          "errorCode": "NOT_FOUND",
                          "details": "...",
                          "path": "/api/ordenes-mantenimiento/{id}"
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
                          "details": "NullPointerException ...",
                          "path": "/api/ordenes-mantenimiento/{id}"
                        }
                        """)
                )
        )
})
public @interface UpdateMaintenanceOrderEndpointDoc {}
