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
        security = @SecurityRequirement(name = "bearer-key")
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
                  "message": "Embarcación obtenida exitosamente.",
                  "data": {
                    "id": 1,
                    "name": "Embarcación A",
                    "registrationNumber": "ABC123",
                    "ismm": "123456",
                    "flagState": "ARG",
                    "callSign": "LXYZ",
                    "portOfRegistry": "Puerto Buenos Aires",
                    "rif": "RIF123456",
                    "serviceType": "Lanchaje",
                    "constructionMaterial": "Fibra de vidrio",
                    "sternType": "Cuadrada",
                    "fuelType": "Diesel",
                    "navigationHours": 120.5
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
                  "errorCode": "RESOURCE_NOT_FOUND",
                  "details": "...",
                  "path": "/api/vessels/{id}"
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
                  "path": "/api/vessels/{id}"
                }
            """)
                )
        )
})
public @interface GetEmbarcacionByIdEndpointDoc {}
