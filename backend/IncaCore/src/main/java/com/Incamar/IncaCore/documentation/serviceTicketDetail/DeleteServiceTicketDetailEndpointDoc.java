package com.Incamar.IncaCore.documentation.serviceTicketDetail;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for DELETE /api/boleta-servicio-detalle/{id}
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Eliminar detalle de boleta de servicio",
        description = """
        Elimina de forma permanente un detalle de boleta de servicio (<code>ServiceTicketDetail</code>) \
        identificado por su <code>ID</code>. \
        Requiere autenticación con roles: <strong>ADMIN, PATRON o SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "204",
                description = "Detalle de boleta de servicio eliminado correctamente",
                content = @Content // No Content (sin body en la respuesta)
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado (token ausente o inválido)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 401,
                          "message": "Acceso no autorizado",
                          "errorCode": "UNAUTHORIZED",
                          "details": "...",
                          "path": "/api/boleta-servicio-detalle/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado por falta de permisos",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 403,
                          "message": "Acceso denegado",
                          "errorCode": "FORBIDDEN",
                          "details": "...",
                          "path": "/api/boleta-servicio-detalle/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Detalle de boleta no encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Detalle de boleta de servicio no encontrado con id: 99",
                          "errorCode": "NOT_FOUND",
                          "details": "...",
                          "path": "/api/boleta-servicio-detalle/{id}"
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error interno del servidor",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 500,
                          "message": "Error inesperado",
                          "errorCode": "INTERNAL_SERVER_ERROR",
                          "details": "NullPointerException ...",
                          "path": "/api/boleta-servicio-detalle/{id}"
                        }
                        """)
                )
        )
})
public @interface DeleteServiceTicketDetailEndpointDoc {}

