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
        summary = "Obtener total de horas viajadas",
        description = """
        Calcula la cantidad total de horas recorridas a partir de todos los viajes \
        registrados en un `ServiceTicketDetail`. \
        Accesible a usuarios con roles: <strong>ADMIN, PATRON, SUPERVISOR</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Horas calculadas exitosamente",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "totalHours": 18
                        }
                        """))),
        @ApiResponse(responseCode = "404", description = "Detalle de boleta no encontrado",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "ServiceTicketDetail no encontrado con ID: 12",
                          "errorCode": "NOT_FOUND",
                          "path": "/api/travels/detail/12/total-hours"
                        }
                        """)))
})
public @interface CreateTravelEndpointDoc {
}
