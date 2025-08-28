package com.Incamar.IncaCore.documentation.user;

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
        summary = "Buscar usuarios por nombre de usuario con paginación",
        description = """
        Retorna una lista paginada de usuarios cuyo nombre de usuario coincida parcialmente \
        (ignorando mayúsculas) con el valor proporcionado en el parámetro `username`. \
        <strong>Solo accesible para usuarios con rol ADMIN, SUPERVISOR, OPERATOR.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Usuarios encontrados exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "content": [
                    {
                      "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                      "username": "edgar123",
                      "role": "USER"
                    },
                    {
                      "uuid": "6f4b3b4e-2f21-478a-857e-7cfe546d35fa",
                      "username": "eduardo",
                      "role": "ADMIN"
                    }
                  ],
                  "pageable": {
                    "pageNumber": 0,
                    "pageSize": 10
                  },
                  "totalElements": 2,
                  "totalPages": 1,
                  "last": true,
                  "first": true,
                  "empty": false
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado por falta de permisos. Usuario con rol no autorizado.",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 403,
                  "message": "Acceso denegado",
                  "errorCode": "FORBIDDEN",
                  "details": "...",
                  "path": "/api/users/search"
                }
            """)
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "No autorizado (token ausente o inválido).",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 401,
                  "message": "Acceso no autorizado",
                  "errorCode": "AUTH_ERROR",
                  "details": "...",
                  "path": "/api/users/search"
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
                  "details": "...",
                  "path": "/api/users/search"
                }
                """)
                )
        )
})
public @interface SearchUsersEndpointDoc {}

