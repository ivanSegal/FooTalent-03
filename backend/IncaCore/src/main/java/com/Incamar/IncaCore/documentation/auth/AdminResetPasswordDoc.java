package com.Incamar.IncaCore.documentation.auth;

import com.Incamar.IncaCore.dto.response.CredentialsRes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Documentación Swagger para POST /api/auth/admin/reset-password.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Restablecer contraseña (ADMIN)",
        description = """
         Permite a un administrador restablecer la contraseña de un usuario del sistema. \
         La nueva contraseña será temporal y deberá ser cambiada por el usuario en su próximo inicio de sesión.
        """,
        security = @SecurityRequirement(name = "bearerAuth")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Contraseña restablecida correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                implementation = CredentialsRes.class
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida o error de validación",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Error de validación",
                                        summary = "Campos obligatorios faltantes o inválidos",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Falló la validación de los campos",
                                              "errorCode": "VALIDATION_ERROR",
                                              "details": [
                                                "username: El nombre de usuario es requerido"
                                              ],
                                              "path": "/api/auth/admin/reset-password"
                                            }
                                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado o token inválido",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "statusCode": 401,
                                      "errorCode": "AUTH_ERROR",
                                      "message": "Acceso no autorizado. Token inválido o ausente.",
                                      "details": [],
                                      "path": "/api/auth/admin/reset-password"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado: el usuario no tiene permisos para esta acción",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "statusCode": 403,
                                      "errorCode": "ACCESS_DENIED",
                                      "message": "Acceso denegado: no tienes permiso para acceder a este recurso.",
                                      "details": [],
                                      "path": "/api/auth/admin/reset-password"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Usuario no encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                    {
                                      "statusCode": 404,
                                      "errorCode": "NOT_FOUND",
                                      "message": "Usuario no encontrado",
                                      "details": [],
                                      "path": "/api/auth/admin/reset-password"
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
                                      "message": "Ocurrió un error interno en el servidor",
                                      "errorCode": "INTERNAL_ERROR",
                                      "details": ["java.lang.NullPointerException: ..."],
                                      "path": "/api/auth/admin/reset-password"
                                    }
                                """
                        )
                )
        )
})
public @interface AdminResetPasswordDoc {
}