package com.Incamar.IncaCore.documentation.maintenanceOrder;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for POST /api/ordenes-mantenimiento.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Crear nueva orden de mantenimiento",
        description = """
        Crea una nueva orden de mantenimiento asociada a una <strong>embarcación</strong> y al <strong>usuario responsable</strong> \
        (tomado del JWT).<br/><br/>
        <strong>Reglas/validaciones relevantes:</strong>
        <ul>
          <li><code>vesselId</code> es obligatorio y debe existir.</li>
          <li><code>maintenanceType</code> Solo puede ser PREVENTIVO o CORRECTIVO </li>
          <li><code>status</code> EN_PROCESO, ANULADO, ESPERANDO_INSUMOS, SOLICITADO o RECHAZADO </li>
          <li>Requeridos además: <code>issuedAt (dd-MM-yyyy)</code>, <code>scheduledAt (dd-MM-yyyy)</code>, \
          <code>startedAt (dd-MM-yyyy)</code>,<code>finishedAt (dd-MM-yyyy)</code>,<code>maintenanceReason</code>.</li>
        </ul>
        Crea una nueva orden de mantenimiento en el sistema especificando id de Embarcacion, tipo de mantenimiento, estado y descripcion.\s
        Requiere autenticación de usuarios con rol <strong>ADMIN, SUPERVISOR o OPERATOR</strong> y \
        pertenecientes al departamento <strong>MANTENIMIENTO</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Orden de Mantenimiento creada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Orden de Mantenimiento creada correctamente.",
                      "data": {
                        "id": 1,
                        "vesselId": "2",
                        "maintenanceType": "PREVENTIVO",
                        "status": "SOLICITADO",
                        "maintenanceManager": "Juan Perez",
                        "maintenanceReason":"...",
                        "issuedAt":"...",
                        "scheduledAt":"...",
                        "startedAt":"...",
                        "finishedAt": "...",
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
                                        name = "Campos requeridos faltantes",
                                        summary = "Cuando falta el campo embarcacion_id o tipo_mantenimiento",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Error validation with data",
                                              "errorCode": "VALIDATION_ERROR",
                                              "detailsError": "tipo_mantenimiento: no puede estar vacío",
                                              "path": "/api/ordenes-mantenimiento"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Estado y/o Tipo de Mantenimiento incorrectos",
                                        summary = "Cuando se ingresa un valor en estado y/o tipo de mantenimiento " +
                                                "fuera de los permitidos",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "errorCode": "VALIDATION_ERROR",
                                              "message": "...",
                                              "detailsError": "tipoMantenimiento: El tipo de mantenimiento debe ser uno de los siguientes: PREVENTIVO o CORRECTIVO",
                                              "path": "/api/ordenes-mantenimiento"
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
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 401,
                      "message": "Acceso no autorizado",
                      "errorCode": "UNAUTHORIZED",
                      "details": "...",
                      "path": "/api/ordenes-mantenimiento"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso denegado por falta de permisos",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "statusCode": 403,
                      "message": "Acceso denegado",
                      "errorCode": "FORBIDDEN",
                      "details": "Se requiere rol ADMIN, SUPERVISOR o OPERADOR y ser del departamento MANTENIMIENTO",
                      "path": "/api/ordenes-mantenimiento"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Embarcación no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "errorCode": "NOT_FOUND",
                          "message": "Embarcación no encontrada con id: {id}",
                          "details": "...",
                          "path": "/api/ordenes-mantenimiento"
                        }
                        """)
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
                      "message": "Internal Error Server",
                      "errorCode": "INTERNAL_ERROR",
                      "detailsError": "NullPointerException...",
                      "path": "/api/ordenes-mantenimiento"
                    }
                """
                        )
                )
        )
})
public @interface CreateMaintenanceOrderEndpointDoc {}