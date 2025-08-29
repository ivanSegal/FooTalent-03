package com.Incamar.IncaCore.documentation.vesselItem;

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
        summary = "Envia un email con información de los componentes que requeiren mantenimiento",
        description = """
        Se envia un email al correo especificado en donde se detalla que componentes de las embarcaciones llegaron \s
        a las horas que sugiere el fabricante para su mantenimiento, solo para usuaios ADMIN y SUPERVISOR
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(
        value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Emaiil enviado exitosamente",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(
                                        example = """
                                                   {
                                                     "success": true,
                                                     "message": "Se ha enviaddo un correo con la inormación requerida",
                                                     "data": {}
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
                                                name = "Error de validación",
                                                summary = "Cuando faltan campos obligatorios o no cumplen formato",
                                                value = """
                                                        {
                                                           "statusCode": 400,
                                                           "errorCode": "VALIDATION_ERROR",
                                                           "message": "Falló la validación de los campos",
                                                           "details": [
                                                             "email: El email es requerido"
                                                           ],
                                                           "path": "/api/vessel-item/maintenance-alert"
                                                         }
                                                """
                                        )
                                }
                        )
                ),
                @ApiResponse(
                        responseCode = "401",
                        description = "No autorizado: token inválido o ausente",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(
                                        example = """
                                                {
                                                   "statusCode": 401,
                                                   "errorCode": "AUTH_ERROR",
                                                   "message": "Acceso no autorizado. Token inválido o ausente.",
                                                   "details": [
                                                     "Se requiere estar autenticado para acceder a este recurso"
                                                   ],
                                                    "path": "/api/vessel-item/maintenance-alert"
                                                 }
                                        """
                                )
                        )
                ),
                @ApiResponse(
                        responseCode = "403",
                        description = "El usuario autenticado no tiene los permisos para usar esta acceder a este recurso",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(
                                        example = """
                                                {
                                                   "statusCode": 403,
                                                   "errorCode": "FORBIDDEN",
                                                   "message": "Acceso denegado: no tienes permisos para acceder a este recurso",
                                                   "details": [
                                                     "El usuario no tiene autorización suficiente para realizar esta acción."
                                                   ],
                                                    "path": "/api/vessel-item/maintenance-alert"
                                                 }
                                        """
                                )
                        )
                ),
                @ApiResponse(
                        responseCode = "500",
                        description = "Error interno del servidor o servicio no disponible",
                        content =
                        @Content(
                                mediaType = "application/json",
                                schema =
                                @Schema(
                                        example =
                                                """
                                                {
                                                  "statusCode": 500,
                                                  "message": "Error al registrar el usuario",
                                                  "errorCode": "SERVICE_UNAVAILABLE",
                                                  "details": ["Error inesperado en el servidor."],
                                                  "path": "/api/auth/register"
                                                }
                                                """
                                )
                        )
                ),
                @ApiResponse(
                        responseCode = "503",
                        description = "Error interno relacionado con el servicio SMTP",
                        content =
                        @Content(
                                mediaType = "application/json",
                                schema =
                                @Schema(
                                        example =
                                                """
                                                        {
                                                           "statusCode": 503,
                                                           "errorCode": "MAIL_ERROR",
                                                           "message": "Error de autenticación al enviar el correo: verifica usuario y contraseña del SMTP",
                                                           "details": [
                                                             "Authentication failed"
                                                           ],
                                                            "path": "/api/vessel-item/maintenance-alert"
                                                         }
                                                """
                                )
                        )
                )

        }
)
public @interface NotificationEmailVesselItemEndpoindDoc {}
