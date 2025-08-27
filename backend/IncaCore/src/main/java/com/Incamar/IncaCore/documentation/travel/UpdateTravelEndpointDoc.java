package com.Incamar.IncaCore.documentation.travel;

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
        summary = "Actualizar un viaje",
        description = """
        Permite modificar los datos de un viaje existente (origen, destino, \
        hora de salida y hora de llegada). \
        Accesible a usuarios con roles: <strong>ADMIN, SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Viaje actualizado exitosamente",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "id": 5,
                          "origin": "Base Inbuca",
                          "destination": "Criogénico",
                          "departureTime": "10:50",
                          "arrivalTime": "11:50",
                          "totalTraveledTime": "1:00",
                          "serviceTicketDetailId": 12
                        }
                        """))),
        @ApiResponse(responseCode = "404", description = "Viaje no encontrado",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Travel no encontrado con ID: 7",
                          "errorCode": "NOT_FOUND",
                          "path": "/api/travels/7"
                        }
                        """))),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 400,
                          "message": "Formato de hora inválido en departureTime",
                          "errorCode": "MESSAGE_NOT_READABLE",
                          "path": "/api/travels/7"
                        }
                        """)))
})
public @interface UpdateTravelEndpointDoc {
}
