package com.Incamar.IncaCore.documentation.vessel;

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
        summary = "Buscar embarcaciones por nombre con paginación",
        description = """
        Retorna una lista paginada de embarcaciones cuyo nombre coincida parcialmente \
        (ignorando mayúsculas) con el valor proporcionado en el parámetro `nombre`. \
        <strong>Solo accesible para usuarios con rol ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Embarcaciones encontradas exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Embarcaciones obtenidas exitosamente.",
                  "data": {
                    "content": [
                      {
                        "id": 6,
                        "name": "Titanic II",
                        "registrationNumber": "ABC-1234",
                        "ismm": "ISM-9087",
                        "flagState": "Panamá",
                        "callSign": "YYV-3742",
                        "portOfRegistry": "Puerto Cabello",
                        "rif": "J-12345678-9",
                        "serviceType": "Carga",
                        "constructionMaterial": "Acero",
                        "sternType": "Popa abierta",
                        "fuelType": "Diesel",
                        "navigationHours": 12500.5
                      }
                    ],
                    "pageable": {
                      "pageNumber": 0,
                      "pageSize": 20,
                      "sort": {
                        "empty": true,
                        "unsorted": true,
                        "sorted": false
                      },
                      "offset": 0,
                      "paged": true,
                      "unpaged": false
                    },
                    "last": true,
                    "totalElements": 1,
                    "totalPages": 1,
                    "size": 20,
                    "number": 0,
                    "sort": {
                      "empty": true,
                      "unsorted": true,
                      "sorted": false
                    },
                    "first": true,
                    "numberOfElements": 1,
                    "empty": false
                  }
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
                  "path": "/api/embarcaciones/search"
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
                  "path": "/api/embarcaciones/search"
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
                  "path": "/api/embarcaciones/search"
                }
                """)
                )
        )
})
public @interface SearchEmbarcacionesEndpointDoc {}

