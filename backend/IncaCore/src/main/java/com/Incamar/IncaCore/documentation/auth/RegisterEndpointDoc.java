package com.Incamar.IncaCore.documentation.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for POST /auth/register.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Registrar nuevo usuario",
        description = """
        Crea un nuevo usuario con el rol especificado. Si el rol es diferente a <b>ADMIN</b> se tendra que añadir un departamento <b>(INVENTORY, MAINTENANCE, VESSEL)</b> \s
        Esta operación requiere que el solicitante esté autenticado y tenga el rol <code>ADMIN</code>. \s
        Las credenciales de acceso se enviarán automáticamente al correo electronico asociado al usuario creado. \s
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(
        value = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Registro exitoso",
                        content = @Content(
                                mediaType = "application/json",
                                schema = @Schema(
                                      example = """
                                                   {
                                                     "success": true,
                                                     "message": "Registro completado con éxito",
                                                     "data": {
                                                       "id": "9a0ddb38-b67f-4828-b50c-844701da868f",
                                                       "firstName": "Juan",
                                                       "lastName": "Perez",
                                                       "email": "juan.perez@example.com",
                                                       "role": "ADMIN",
                                                       "department": null,
                                                       "accountStatus": "ACTIVE"
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
                                                name = "Error de validación",
                                                summary = "Cuando faltan campos obligatorios o no cumplen formato",
                                                value = """
                                                        {
                                                           "statusCode": 400,
                                                           "errorCode": "VALIDATION_ERROR",
                                                           "message": "Falló la validación de los campos",
                                                           "details": [
                                                             "email: El email es requerido",
                                                             "lastName: El apellido es requerido"
                                                           ],
                                                           "path": "/api/auth/register"
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
                                                   "path": "/api/auth/register"
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
                                                   "path": "/api/auth/register"
                                                 }
                                        """
                                )
                        )
                ),
                @ApiResponse(
                        responseCode = "409",
                        description = "Conflicto: email o usuario ya registrado",
                        content =
                        @Content(
                                mediaType = "application/json",
                                schema =
                                @Schema(
                                        example =
                                                """
                                                {
                                                  "statusCode": 409,
                                                  "message": "El email ya está en uso",
                                                  "errorCode": "CONFLICT",
                                                  "details": ["email: usuario@dominio.com ya registrado."],
                                                  "path": "/api/auth/register"
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
                                                           "path": "/api/auth/register"
                                                         }
                                                """
                                )
                        )
                )

        }
)
public @interface RegisterEndpointDoc {}
