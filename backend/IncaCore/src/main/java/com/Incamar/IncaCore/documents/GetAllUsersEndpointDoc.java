package com.Incamar.IncaCore.documents;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
    summary = "Obtener todos los usuarios",
    description = """
        Retorna la lista completa de usuarios del sistema. \
        <strong>Solo accesible para usuarios con rol ADMIN.</strong>
        """
)
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "Lista de usuarios obtenida exitosamente",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Se enviaron correctamente la lista de usuarios.",
                  "data": [
                    {
                      "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                      "username": "juanperez",
                      "role": "ADMIN"
                    }
                  ]
                }
                """)
        )
    ),
    @ApiResponse(
        responseCode = "404",
        description = "Usuario no encontrado",
        content =
        @Content(
            mediaType = "application/json",
            schema =
            @Schema(
                example =
                    """
                        {
                          "statusCode": 404,
                          "message": "Usuario no encontrado con id: ...",
                          "errorCode": "NOT_FOUND",
                          "details": "...",
                          "path": "/api/users/getAllUsers"
                        }
                        """))),
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
                  "path": "/api/users/getAllUsers"
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
                  "path": "/api/users/getAllUsers"
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
                          "path": "/api/users/getAllUsers"
                        }
                        """))),

})
public @interface GetAllUsersEndpointDoc {}
