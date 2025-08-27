package com.Incamar.IncaCore.dtos.vesselItemHours;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.List;

public record VesselItemHoursUpdateReq(
        @NotNull
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        @Schema(description = "Fecha del historial", example = "25-08-2025")
        LocalDate date,

        String description,

        @NotNull
        @Schema(description = "Lista de detalles de horas por componente")
        List<VesselItemHoursReq.Items> items

) {
    public record Items(
            @NotNull
            @Schema(description = "ID del componente/ítem de embarcación", example = "10")
            Long vesselItemId,

            @NotNull
            @Positive
            @Schema(description = "Horas asignadas a este componente", example = "5.5")
            Double addedHours
    ) {}
}
