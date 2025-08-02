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
        summary = "Crear nueva embarcación",
        description = """
         Crea una nueva embarcación en el sistema con nombre, número de patente, capitán y modelo. \s
         Devuelve un mensaje de éxito con estado <b>200 OK</b>.
        \s""",
        security = @SecurityRequirement(name = "bearer-key")

)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Embarcación creada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Embarcación creada correctamente.",
                      "data": {
                        "id": 101,
                        "nombre": "Titanic II",
                        "patente": "ABC1234",
                        "capitan": "Juan Pérez",
                        "modelo": "Modelo 2025"
                      }
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: error de validación o datos incorrectos",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Campos requeridos faltantes",
                                        summary = "Cuando falta el campo nombre, patente o capitán",
                                        value = """
                        {
                          "statusCode": 400,
                          "message": "Error validation with data",
                          "errorCode": "VALIDATION_ERROR",
                          "detailsError": "nombre: no puede estar vacío",
                          "path": "/api/embarcaciones"
                        }
                    """
                                ),
                                @ExampleObject(
                                        name = "Patente duplicada",
                                        summary = "Cuando se intenta registrar una patente ya existente",
                                        value = """
                        {
                          "statusCode": 400,
                          "message": "La patente ya está registrada",
                          "errorCode": "DUPLICATE_ENTRY",
                          "detailsError": "patente: ABC1234",
                          "path": "/api/embarcaciones"
                        }
                    """
                                )
                        }
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
                      "detailsError": "NullPointerException...",
                      "path": "/api/embarcaciones"
                    }
                """
                        )
                )
        )
})
public @interface CreateEmbarcacionEndpointDoc {
}
