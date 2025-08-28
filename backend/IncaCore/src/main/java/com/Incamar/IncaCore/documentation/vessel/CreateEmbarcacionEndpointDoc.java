package com.Incamar.IncaCore.documentation.vessel;

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
        summary = "Crear una embarcación",
        description = """
        Crea una nueva embarcación especificando nombre, número de registro (matricula), ISMM, \
        estado de bandera, distintivo, puerto de registro, RIF, tipo de servicio, \
        material de construcción, tipo de popa, tipo de combustible y horas de navegación. \
        Requiere autenticación de usuarios con rol <strong>ADMIN, OPERATOR, SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
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
                        "name": "Titanic II Renovado",
                        "registrationNumber": "ABC1234",
                        "ismm": "ISM-9087",
                        "flagState": "Panamá",
                        "callSign": "YYV-3742",
                        "portOfRegistry": "Puerto Cabello",
                        "rif": "J-12345678-9",
                        "serviceType": "Carga",
                        "constructionMaterial": "Acero",
                        "sternType": "Popa abierta",
                        "fuelType": "Diesel",
                        "navigationHours": 13000.0
                      }
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
                                              "path": "/api/vessels/create"
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
                                              "path": "/api/vessels/create"
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
                      "path": "/error"
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
                      "path": "/api/vessels/create"
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
                      "path": "/api/vessels/create"
                    }
                """
                        )
                )
        )
})
public @interface CreateEmbarcacionEndpointDoc {}