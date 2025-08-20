package com.Incamar.IncaCore.documentation.embarcacion;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;


/**
 * Swagger documentation for PUT /api/embarcaciones.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Actualizar embarcación",
        description = """
        Actualiza la información de una embarcación existente identificada por su ID. \
        Accesible solo para usuarios autorizados con rol <strong>ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Embarcación actualizada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "success": true,
                          "message": "Embarcación actualizada correctamente.",
                          "data": {
                            "id": 101,
                            "name": "Nuevo Nombre",
                            "registrationNumber": "XYZ9876",
                            "ismm": "ISM-2025-001",
                            "flagState": "Panamá",
                            "callSign": "YYV-3742",
                            "portOfRegistry": "Puerto Cabello",
                            "rif": "J-12345678-9",
                            "serviceType": "Lanchaje",
                            "constructionMaterial": "Acero",
                            "sternType": "Popa Cuadrada",
                            "fuelType": "Diesel",
                            "navigationHours": 1520.75
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
                          "details": "registrationNumber: no puede estar vacío",
                          "path": "/api/vessels/{id}"
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
                          "path": "/api/vessels/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Embarcación no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Embarcación no encontrada con id: 101",
                          "errorCode": "RESOURCE_NOT_FOUND",
                          "details": "...",
                          "path": "/api/vessels/{id}"
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
                          "path": "/api/vessels/{id}"
                        }
                        """)
                )
        )
})
public @interface UpdateEmbarcacionEndpointDoc {}
