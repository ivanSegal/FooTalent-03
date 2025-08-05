package com.Incamar.IncaCore.documentation.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
    summary = "Obtener usuario por ID",
    description = """
        Devuelve los datos de un usuario específico. \
        • <strong>El usuario debe ser el mismo que el del token</strong> o tener rol <strong>ADMIN</strong>. \
        • Usuarios con roles WAREHOUSE_STAFF u OPERATIONS_MANAGER solo pueden ver su propio perfil.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "Usuario encontrado exitosamente",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Usuario encontrado exitosamente.",
                  "data": {
                    "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "username": "juanperez",
                    "role": "WAREHOUSE_STAFF"
                  }
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
                          "path": "/api/users/getUserById/..."
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
                  "path": "/api/users/getUserById/..."
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
                  "path": "/api/users/getUserById/..."
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
                          "path": "/api/users/getUserById/..."
                        }
                        """))),
})
public @interface GetUserByIdEndpointDoc {
}
