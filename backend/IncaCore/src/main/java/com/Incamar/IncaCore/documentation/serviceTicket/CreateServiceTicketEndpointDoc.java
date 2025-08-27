package com.Incamar.IncaCore.documentation.serviceTicket;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for POST /api/boleta-servicio
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Crear nueva boleta de servicio",
        description = """
        Crea una nueva boleta de servicio asociada a una <strong>embarcación</strong> y al <strong>usuario responsable</strong> \
        (tomado del JWT).<br/><br/>
        <strong>Reglas/validaciones relevantes:</strong>
        <ul>
          <li><code>boatId</code> es obligatorio y debe existir.</li>
          <li><code>reportTravelNro</code> debe cumplir el patrón: <em>AAA-00-0</em> hasta <em>AAAA-00-0000</em> \
              (regex: <code>^[A-Z]{3,4}-\\d{2}-\\d{1,4}$</code>).</li>
          <li><code>travelNro</code> debe coincidir con el <strong>bloque numérico final</strong> de <code>reportTravelNro</code> \
              (3 a 4 dígitos). Ej.: si <code>reportTravelNro = "AAA-05-0123"</code>, entonces <code>travelNro = 123</code>.</li>
          <li>Requeridos además: <code>travelDate (dd-MM-yyyy)</code>, <code>vesselAttended</code>, <code>solicitedBy</code>, <code>code</code>, <code>checkingNro</code>.</li>
        </ul>
       Requiere autenticación de usuarios con rol <strong>ADMIN, SUPERVISOR, OPERATOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Boleta de servicio creada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "success": true,
                  "message": "Boleta de servicio creada correctamente.",
                  "data": {
                    "id": 12,
                    "travelNro": 123,
                    "travelDate": "20-08-2025",
                    "vesselAttended": "Varada Blessing",
                    "solicitedBy": "Kronos",
                    "reportTravelNro": "AAA-05-0123",
                    "code": "COD-AB12",
                    "checkingNro": 987,
                    "boatName": "Atlántida",
                    "responsibleUsername": "j.perez"
                  }
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Solicitud inválida: error de validación o datos incorrectos",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Campos requeridos faltantes",
                                        summary = "Falta boatId u otros campos obligatorios",
                                        value = """
                        {
                          "statusCode": 400,
                          "message": "Error de validación",
                          "errorCode": "VALIDATION_ERROR",
                          "detailsError": "boatId: no puede ser nulo",
                          "path": "/api/boleta-servicio"
                        }
                        """
                                ),
                                @ExampleObject(
                                        name = "Patrón de reportTravelNro inválido",
                                        summary = "No cumple el formato AAA-00-0 .. AAAA-00-0000",
                                        value = """
                        {
                          "statusCode": 400,
                          "errorCode": "VALIDATION_ERROR",
                          "message": "...",
                          "detailsError": "reportTravelNro: debe cumplir el patrón [A-Z]{3,4}-\\d{2}-\\d{1,4}",
                          "path": "/api/boleta-servicio"
                        }
                        """
                                ),
                                @ExampleObject(
                                        name = "Inconsistencia travelNro vs reportTravelNro",
                                        summary = "travelNro no coincide con el bloque final de reportTravelNro",
                                        value = """
                        {
                          "statusCode": 400,
                          "errorCode": "VALIDATION_ERROR",
                          "message": "...",
                          "detailsError": "travelNro: debe coincidir con los últimos dígitos de reportTravelNro",
                          "path": "/api/boleta-servicio"
                        }
                        """
                                )
                        }
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
                  "path": "/api/boleta-servicio"
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
                  "details": "Se requiere rol ADMIN, PATRON o SUPERVISOR",
                  "path": "/api/boleta-servicio"
                }
                """)
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Recurso no encontrado (Embarcación o Usuario responsable)",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                {
                  "statusCode": 404,
                  "errorCode": "NOT_FOUND",
                  "message": "Embarcación asociada a la boleta de servicio no encontrada.",
                  "path": "/api/boleta-servicio"
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
                  "path": "/api/boleta-servicio"
                }
                """)
                )
        )
})
public @interface CreateServiceTicketEndpointDoc {}

