package com.Incamar.IncaCore.documentation.embarcacion;

import io.swagger.v3.oas.annotations.Operation;
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
        summary = "Actualizar embarcación",
        description = "Actualiza la información de una embarcación existente.",
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Embarcación actualizada correctamente"
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Datos inválidos en la solicitud"
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Embarcación no encontrada"
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error interno del servidor"
        )
})
public @interface UpdateEmbarcacionEndpointDoc {}
