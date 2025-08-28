package com.Incamar.IncaCore.dtos.vesselItemHours;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record VesselItemHoursRes(

        Long id,
        String responsable,
        String comments,
        Long vesselId,
        LocalDate date,
        List<VesselItemHoursRes.Items> items
) {
    public record Items(
            Long vesselItemId,
            Double addedHours
    ) {
    }
}
