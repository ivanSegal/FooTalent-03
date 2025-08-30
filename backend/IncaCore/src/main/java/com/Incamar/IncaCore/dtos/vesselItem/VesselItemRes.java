package com.Incamar.IncaCore.dtos.vesselItem;

import java.math.BigDecimal;

public record VesselItemRes(
        Long id,
        String name,
        String description,
        String controlType,
        BigDecimal accumulatedHours,
        Integer usefulLifeHours,
        Integer alertHours,
        String materialType,
        Long vesselId
) {
}
