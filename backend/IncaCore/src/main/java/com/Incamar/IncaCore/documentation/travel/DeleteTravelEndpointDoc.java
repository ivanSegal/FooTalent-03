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
        summary = "Eliminar un viaje",
        description = """
        Elimina un viaje existente de la base de datos. \
        Accesible a usuarios con roles: <strong>ADMIN</strong>.
        """,
        security = @SecurityRequirement(name = "bearer-key")
)
@ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Viaje eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Viaje no encontrado",
                content = @Content(mediaType = "application/json",
                        schema = @Schema(example = """
                        {
                          "statusCode": 404,
                          "message": "Travel no encontrado con ID: 7",
                          "errorCode": "NOT_FOUND",
                          "path": "/api/travels/7"
                        }
                        """)))
})
public @interface DeleteTravelEndpointDoc {
}
