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
        summary = "Ver los viajes asociados a un detalle de boleta",
        description = """
        Registra un viaje con su origen, destino y horarios. \
        Debe estar vinculado a un `ServiceTicketDetail`. \
        Accesible a usuarios con roles: <strong>ADMIN, OPERATOR, SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Viaje creado correctamente",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "id": 7,
                          "origin": "Rosario",
                          "destination": "Santa Fe",
                          "departureTime": "10:00",
                          "arrivalTime": "11:30",
                          "serviceTicketDetailId": 15
                        }
                        """))),
        @ApiResponse(responseCode = "404", description = "Detalle de boleta no encontrado",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "ServiceTicketDetail no encontrado con ID: 15",
                          "errorCode": "NOT_FOUND",
                          "path": "/api/travels"
                        }
                        """)))
})
public @interface GetTravelsByDetailEndpointDoc {}

