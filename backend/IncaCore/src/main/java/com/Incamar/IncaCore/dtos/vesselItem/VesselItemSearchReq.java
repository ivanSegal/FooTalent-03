package com.Incamar.IncaCore.dtos.vesselItem;

import io.swagger.v3.oas.annotations.media.Schema;

public record VesselItemSearchReq(
        @Schema(description = "Id de la embarcacion de la que quiere obtener todos sus componentes")
        Long vesselId,

        @Schema(description = "Nombre de la embarcacion de la que quiere obtener todos sus compoenntes")
        String vesselName
) {
}
