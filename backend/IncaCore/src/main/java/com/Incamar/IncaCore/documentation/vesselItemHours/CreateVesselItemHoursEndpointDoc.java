package com.Incamar.IncaCore.documentation.vesselItemHours;

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
        summary = "Crear boleta de registro horas por componentes de embarcación",
        description = """
        Sirve para añadir la hora de uso de los componente a una embarcación\
        Requiere autenticación de usuarios con rol <strong>ADMIN</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Operación exitosa",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Boleta de registro de horas de componentes de embarcación creada correctamente.",
                      "data": {null}
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: credenciales incorrectas o error de validación",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Campos inválidas",
                                        summary = "Cuando el nombre de la embarcacion ya existe",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "El nombre de la embarcacion ya existe.",
                                              "errorCode": "BAD_REQUEST",
                                              "detailsError": "...",
                                              "path": "/api/vessel-item"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Error de validación",
                                        summary = "Cuando faltan campos requeridos o tienen formato incorrecto",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Error de validación en los datos",
                                              "errorCode": "VALIDATION_ERROR",
                                              "detailsError": "name: no puede estar vacío, registrationNumber: formato inválido",
                                                "path": "/api/vessel-item"
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
                      "path": "/api/vessel-item"
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
                      "path": "/api/vessel-item"
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
                      "detailsError": "NullPointerException...",
                      "path": "/api/vessel-item"
                    }
                """
                        )
                )
        )
})


public @interface CreateVesselItemHoursEndpointDoc {
}
