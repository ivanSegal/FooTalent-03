package com.Incamar.IncaCore.documentation.vessel;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for GET /api/embarcaciones.
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener todas las embarcaciones",
        description = """
        Retorna una lista completa de embarcaciones registradas en el sistema. \
        Accesible para usuarios con roles: <strong>WAREHOUSE_STAFF, OPERATIONS_MANAGER, o ADMIN.</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Lista paginada de embarcaciones obtenida exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Se visualizan exitosamente todas las embarcaciones.",
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
                      },
                      {
                        "id": 7,
                        "name": "Mar Caribe",
                        "registrationNumber": "XYZ7890",
                        "ismm": "ISM-2025",
                        "flagState": "Venezuela",
                        "callSign": "YYV-9999",
                        "portOfRegistry": "La Guaira",
                        "rif": "J-11223344-5",
                        "serviceType": "Pesca",
                        "constructionMaterial": "Acero",
                        "sternType": "Popa Redonda",
                        "fuelType": "Gasolina",
                        "navigationHours": 500.25
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
                    "totalElements": 2,
                    "totalPages": 1,
                    "size": 20,
                    "number": 0,
                    "sort": {
                      "empty": true,
                      "unsorted": true,
                      "sorted": false
                    },
                    "first": true,
                    "numberOfElements": 2,
                    "empty": false
                  }
                }
                """)
                )
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
                  "errorCode": "AUTH_ERROR",
                  "details": "...",
                  "path": "/api/vassels"
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
                  "path": "/api/vassels"
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
                  "path": "/api/vassels"
                }
                """)
                )
        )
})
public @interface GetAllEmbarcacionesEndpointDoc {}

