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
        summary = "Obtener viajes asociados a un detalle de boleta de servicio",
        description = """
        Retorna la lista de viajes registrados para un `ServiceTicketDetail` específico, \
        incluyendo origen, destino, hora de salida y llegada. \
        Accesible a usuarios con roles: <strong>ADMIN, PATRON, SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Viajes obtenidos exitosamente",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        [
                          {
                            "id": 5,
                            "origin": "Bahía de José",
                            "destination": "Bahía de Pertigalete",
                            "departureTime": "08:30",
                            "arrivalTime": "12:45",
                            "serviceTicketDetailId": 12
                          }
                        ]
                        """))),
        @ApiResponse(responseCode = "404", description = "Detalle de boleta no encontrado",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "ServiceTicketDetail no encontrado con ID: 12",
                          "errorCode": "NOT_FOUND",
                          "path": "/api/travels/detail/12"
                        }
                        """)))
})
public @interface GetTotalHoursByDetailEndpointDoc {
}
