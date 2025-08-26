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
 * Swagger documentation for POST /api/boleta-servicio-detalle
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Crear un nuevo detalle de boleta de servicio",
        description = """
        Crea un registro de detalle asociado a una boleta de servicio (<code>ServiceTicket</code>) existente.<br/><br/>
        <strong>Validaciones:</strong>
        <ul>
          <li><code>serviceTicketId</code> es obligatorio y debe existir.</li>
          <li><code>serviceArea</code>, <code>serviceType</code>, <code>description</code> no pueden estar vacíos.</li>
          <li><code>hoursTraveled</code> debe ser un número entero positivo o cero.</li>
          <li><code>patronFullName</code>, <code>marinerFullName</code> y <code>captainFullName</code> deben contener solo letras y espacios, máx 50 caracteres.</li>
        </ul>
        Requiere autenticación con roles: <strong>ADMIN, OPERADOR o SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Detalle de boleta de servicio creado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Detalles de la boleta de servicio creados correctamente.",
                  "data": {
                    "id": 45,
                    "serviceTicketId": 12,
                    "serviceArea": "Bahía de Pozuelos",
                    "serviceType": "Traslado de materiales",
                    "description": "Servicio de traslado de materiales prestado a Kronos.",
                    "hoursTraveled": "06:15",
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
                description = "Error de validación en los campos de entrada",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Faltan campos obligatorios",
                                        value = """
                        {
                          "statusCode": 400,
                          "errorCode": "VALIDATION_ERROR",
                          "message": "Error validation with data",
                          "detailsError": "serviceArea: no puede estar vacío",
                          "path": "/api/boleta-servicio-detalle"
                        }
                        """
                                ),
                                @ExampleObject(
                                        name = "Formato inválido en nombres",
                                        value = """
                        {
                          "statusCode": 400,
                          "errorCode": "VALIDATION_ERROR",
                          "message": "...",
                          "detailsError": "patronFullName: debe contener solo letras y espacios",
                          "path": "/api/boleta-servicio-detalle"
                        }
                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Boleta de servicio padre no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "errorCode": "NOT_FOUND",
                          "message": "ServiceTicket no encontrado con id: {id}",
                          "path": "/api/boleta-servicio-detalle"
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
                          "path": "/api/boleta-servicio-detalle"
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
                          "path": "/api/boleta-servicio-detalle"
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
                          "path": "/api/boleta-servicio-detalle"
                        }
                        """)
                )
        )
})
public @interface CreateServiceTicketDetailEndpointDoc {}
