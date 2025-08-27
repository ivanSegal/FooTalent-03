package com.Incamar.IncaCore.documentation.serviceTicketDetail;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for PUT /api/boleta-servicio-detalle/{id}
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Actualizar un detalle de boleta de servicio",
        description = """
        Actualiza los campos de un detalle de boleta de servicio (<code>ServiceTicketDetail</code>) existente \
        identificado por su <code>ID</code>.<br/><br/>
        <strong>Validaciones:</strong>
        <ul>
          <li>El <code>id</code> debe existir en la base de datos.</li>
          <li><code>hoursTraveled</code> ≥ 0 (positivo o cero).</li>
          <li><code>patronFullName</code>, <code>marinerFullName</code>, <code>captainFullName</code> solo aceptan letras y espacios (máx 50).</li>
        </ul>
        Requiere autenticación con roles: <strong>ADMIN, PATRON o SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Detalle actualizado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "success": true,
                          "message": "Detalle de boleta de servicio actualizado correctamente.",
                          "data": {
                            "id": 45,
                            "serviceTicketId": 12,
                            "serviceArea": "Bahía de Pozuelos",
                            "serviceType": "Transporte de personal",
                            "description": "Se actualizó la descripción del servicio.",
                            "hoursTraveled": 8,
                            "patronFullName": "Juan Pérez",
                            "marinerFullName": "Mario Sosa",
                            "captainFullName": "Carlos Fernández"
                          }
                        }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Datos inválidos en la solicitud",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Horas negativas",
                                        value = """
                        {
                          "statusCode": 400,
                          "errorCode": "VALIDATION_ERROR",
                          "message": "Error validation with data",
                          "detailsError": "hoursTraveled: debe ser mayor o igual a 0",
                          "path": "/api/boleta-servicio-detalle/{id}"
                        }
                        """
                                ),
                                @ExampleObject(
                                        name = "Formato inválido en nombre",
                                        value = """
                        {
                          "statusCode": 400,
                          "errorCode": "VALIDATION_ERROR",
                          "message": "...",
                          "detailsError": "captainFullName: debe contener solo letras y espacios",
                          "path": "/api/boleta-servicio-detalle/{id}"
                        }
                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Detalle no encontrado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Detalle no encontrado con id: 45",
                          "errorCode": "NOT_FOUND",
                          "path": "/api/boleta-servicio-detalle/{id}"
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
                          "path": "/api/boleta-servicio-detalle/{id}"
                        }
                        """)
                )
        )
})
public @interface UpdateServiceTicketDetailEndpointDoc {}

