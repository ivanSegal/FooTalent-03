package com.Incamar.IncaCore.documentation.serviceTicket;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for DELETE /api/boleta-servicio/{id}
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Eliminar boleta de servicio",
        description = """
        Elimina definitivamente una boleta de servicio por su identificador. \
        Requiere autenticación con rol <strong>ADMIN, PATRON o SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "204",
                description = "Boleta de servicio eliminada correctamente",
                content = @Content // sin body (no content)
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
                  "path": "/api/boleta-servicio/{id}"
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado: el rol del usuario no tiene permisos para eliminar",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 403,
                  "message": "Acceso denegado",
                  "errorCode": "FORBIDDEN",
                  "details": "Se requiere rol ADMIN, PATRON o SUPERVISOR",
                  "path": "/api/boleta-servicio/{id}"
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Boleta de servicio no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "errorCode": "NOT_FOUND",
                  "message": "Boleta de servicio no encontrada. Id = {id}",
                  "path": "/api/boleta-servicio/{id}"
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
                  "path": "/api/boleta-servicio/{id}"
                }
                """)
                )
        )
})
public @interface DeleteServiceTicketEndpointDoc {}


