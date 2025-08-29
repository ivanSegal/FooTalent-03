package com.Incamar.IncaCore.documentation.vesselItem;

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
        summary = "Obtener componente de una embarcación por ID",
        description = """
        Devuelve los detalles de un componente de embarcación específica mediante su ID. \
        Accesible para usuarios con roles: <strong>OPERATOR, SUPERVISOR o ADMIN.</strong>
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
                  "message": "Componente de embarcación obtenida exitosamente.",
                  "data": {
                      "id": 3,
                      "name": "Motor",
                      "description": "Primary propulsion engine",
                      "controlType": "NAVIGATION",
                      "accumulatedHours": 4,
                      "usefulLifeHours": 12000,
                      "alertHours": 10000,
                      "materialType": "COMPONENTS"
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
                  "path": "/api/vessel-item/{id}"
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
                  "path": "/api/vessel-item/{id}"
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
                  "path": "/api/vessel-item/{id}"
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
                  "path": "/api/vessel-item/{id}"
                }
            """)
                )
        )
})
public @interface GetVesselItemByIdEndpointDoc {
}
