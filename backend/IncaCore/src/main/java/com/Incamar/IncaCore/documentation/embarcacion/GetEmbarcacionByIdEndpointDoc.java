package com.Incamar.IncaCore.documentation.embarcacion;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/embarcaciones/{id}.
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener embarcación por ID",
        description = """
        Devuelve los detalles de una embarcación específica mediante su ID. \
        Accesible para usuarios con roles: <strong>WAREHOUSE_STAFF, OPERATIONS_MANAGER o ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearerAuth")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Embarcación encontrada exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Embarcación encontrada exitosamente.",
                  "data": {
                    "id": 1,
                    "nombre": "Embarcación A",
                    "patente": "ABC123",
                    "modelo": "Modelo 2023",
                    "capitan": "Juan Pérez"
                  }
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
                  "message": "Embarcación no encontrada con ID: ...",
                  "errorCode": "NOT_FOUND",
                  "details": "...",
                  "path": "/api/embarcaciones/{id}"
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
                  "path": "/api/embarcaciones/{id}"
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
                  "errorCode": "UNAUTHORIZED",
                  "details": "...",
                  "path": "/api/embarcaciones/{id}"
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
                  "path": "/api/embarcaciones/{id}"
                }
            """)
                )
        )
})
public @interface GetEmbarcacionByIdEndpointDoc {}
