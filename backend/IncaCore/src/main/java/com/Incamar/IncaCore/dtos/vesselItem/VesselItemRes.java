package com.Incamar.IncaCore.dtos.vesselItem;

public record VesselItemRes(
        Long id,
        String name,
        String description,
        String controlType,
        Integer accumulatedHours,
        Integer usefulLifeHours,
        Integer alertHours,
        String materialType,
        Long vesselId
) {
}
