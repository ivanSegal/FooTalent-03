package com.Incamar.IncaCore.documentation.activity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for POST /api/maintenance-activities.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Crear nueva actividad de mantenimiento",
        description = """
        Crea una nueva actividad de mantenimiento asociada a una <strong>orden de mantenimiento</strong> y a un <strong>item de embarcación</strong> \
        <br/><br/>
        <strong>Reglas/validaciones relevantes:</strong>
        <ul>
          <li><code>maintenanceOrderId</code> es obligatorio y debe existir.</li>
          <li><code>vesselItemId</code> es obligatorio y debe existir.</li>
          <li><code>activityType</code> INSEPCCION, LIMPIEZA, LUBRICACION, AJUSTES, CALIBRACION,
          CAMBIO_PROGRAMADO, REEMPLAZO_FALLO o REPARACION</li>
          <li>Requeridos además: <code>inventoryMovementId</code> y <code>description</code>.</li>
        </ul>
        Crea una nueva actividad de mantenimiento en el sistema especificando id de orden de mantenimiento,
        id de Item de embarcacion, tipo de actividad, id de movimiento inventario (si corresponde) y descripcion.\s
        Requiere autenticación de usuarios con rol <strong>ADMIN, SUPERVISOR o OPERATOR</strong> y \
        pertenecientes al departamento <strong>MANTENIMIENTO</strong>
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "201",
                description = "Actividad creada correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                    {
                      "success": true,
                      "message": "Actividad creada correctamente.",
                      "data": {
                        "id": 1,
                        "maintenanceOrderId": "1",
                        "vesselItemId": "2",
                        "activityType": "INSPECCION",
                        "inventoryMovementsIds": [1,2],
                        "description":"...",
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
                                        summary = "Cuando falta el campo maintenanceOrder_id, vessel_item_id o activity_type",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "message": "Error validation with data",
                                              "errorCode": "VALIDATION_ERROR",
                                              "detailsError": "maintenanceOrder_id: no puede estar vacío",
                                              "path": "/api/maintenance-activities"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Tipo de Actividad incorrecto",
                                        summary = "Cuando se ingresa un valor en tipo de actividad " +
                                                "fuera de los permitidos",
                                        value = """
                                            {
                                              "statusCode": 400,
                                              "errorCode": "VALIDATION_ERROR",
                                              "message": "...",
                                              "detailsError": "activity_type: El tipo de actividad debe ser uno de los siguientes: INSPECCION, ...",
                                              "path": "/api/maintenance-activities"
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
                      "path": "/api/maintenance-activities"
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
                      "path": "/api/maintenance-activities"
                    }
                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Orden de Mantenimiento no encontrada",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "errorCode": "NOT_FOUND",
                          "message": "Orden de Mantenimiento no encontrada con id: {id}",
                          "details": "...",
                          "path": "/api/maintenance-activities"
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
                      "path": "/api/maintenance-activities"
                    }
                """
                        )
                )
        )
})
public @interface CreateActivityEndpointDoc {}