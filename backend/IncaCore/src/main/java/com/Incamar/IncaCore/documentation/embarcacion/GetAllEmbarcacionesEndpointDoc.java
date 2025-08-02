package com.Incamar.IncaCore.documentation.embarcacion;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for POST /api/embarcaciones.
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Listar todas las embarcaciones",
        description = "Devuelve una lista con todas las embarcaciones registradas en el sistema.",
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista de embarcaciones obtenida correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    [
                      {
                        "id": 1,
                        "nombre": "Embarcación A",
                        "patente": "ABC123",
                        "modelo": "Modelo 2023",
                        "capitan": "Juan Pérez"
                      },
                      {
                        "id": 2,
                        "nombre": "Embarcación B",
                        "patente": "XYZ789",
                        "modelo": "Modelo 2022",
                        "capitan": "Ana Gómez"
                      }
                    ]
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error interno del servidor"
        )
})
public @interface GetAllEmbarcacionesEndpointDoc {}

