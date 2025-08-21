package com.Incamar.IncaCore.documentation.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Cerrar sesión (logout)",
        description = "Invalida el token JWT del usuario autenticado para cerrar sesión.",
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Logout exitoso",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                {
                  "success": true,
                  "message": "Logout exitoso",
                  "data": null
                }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado: token ausente o inválido",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                {
                  "statusCode": 401,
                  "errorCode": "AUTH_ERROR",
                  "message": "Token inválido o ausente",
                  "details": ["El token JWT no fue proporcionado o es inválido."],
                  "path": "/api/auth/logout"
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
                  "errorCode": "INTERNAL_ERROR",
                  "message": "Error interno del servidor",
                  "details": ["Detalles técnicos del error"],
                  "path": "/api/auth/logout"
                }
                """
                        )
                )
        )
})
public @interface LogoutEndpointDoc {}
