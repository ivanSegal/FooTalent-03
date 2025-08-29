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
        summary = "Obtener todos los usuarios",
        description = """
        Retorna la lista de los componentes que requieren mantenimiento segÚn lo estipulado por el fabricante. \
        <strong>Solo accesible para usuarios con rol ADMIN y SUPERVISOR.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista de componentes que requeiren mantenimiento",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                                {
                                   "success": true,
                                   "message": "Lista de componentes que requieren mantenimiento",
                                   "data": [
                                     {
                                       "id": 1,
                                       "name": "Main Engine",
                                       "description": "Primary propulsion engine",
                                       "controlType": "NAVIGATION",
                                       "accumulatedHours": 10000,
                                       "usefulLifeHours": 12000,
                                       "alertHours": 10000,
                                       "materialType": "COMPONENTS",
                                       "vesselId": 1
                                     }
                                   ]
                                 }
                """)
                )
        ),
        @ApiResponse(responseCode = "403",
                description = "Acceso denegado por falta de permisos. Usuario con rol no autorizado.",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 403,
                  "message": "Acceso denegado",
                  "errorCode": "FORBIDDEN",
                  "details": "...",
                  "path": "/api/vessel-item/maintenance-required"
                }
            """)
                )
        ),
        @ApiResponse(responseCode = "401", description = "No autorizado (token ausente o inválido).",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 401,
                  "message": "Acceso no autorizado",
                  "errorCode": "AUTH_ERROR",
                  "details": "...",
                  "path": "/api/vessel-item/maintenance-required"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error interno del servidor",
                content =
                @Content(
                        mediaType = "application/json",
                        schema =
                        @Schema(
                                example =
                                        """
                                            {
                                              "statusCode": 500,
                                              "message": "Error inesperado",
                                              "errorCode": "INTERNAL_SERVER_ERROR",
                                              "details": "...",
                                              "path": "/api/vessel-item/maintenance-required"
                                            }
                                            """))),

})
public @interface MantenimenceVesselItemsEndpointDoc {}
