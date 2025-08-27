package com.Incamar.IncaCore.dtos.vesselItem;

import com.Incamar.IncaCore.enums.ControlType;
import com.Incamar.IncaCore.enums.MaterialType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

@Schema(name = "VesselItem.VesselItemRequest",
        description = "DTO para crear un VesselItem")
public record VesselItemReq(

        @NotBlank(message = "nombre del item requerido")
        @Schema(description = "Nombre del item", example = "Main Engine", required = true)
        String name,

        @Schema(description = "Descripción opcional del item", example = "Primary propulsion engine")
        String description,

        @Positive
        @Schema(description = "Horas acumuladas de uso (decimal si aplica fracción de horas)", example = "4.5")
        BigDecimal accumulatedHours,

        @Positive
        @Schema(description = "Vida útil en horas (solo horas completas)", example = "12000")
        Integer usefulLifeHours,

        @Positive
        @Schema(description = "Horas de alerta para mantenimiento", example = "10000")
        Integer alertHours,

        @NotNull
        @Schema(description = "Tipo de control del item", allowableValues = {"NAVIGATION","OWN"})
        ControlType controlType,

        @NotNull
        @Schema(description = "Tipo de material del item", example = "COMPONENTS",allowableValues = {"COMPONENTS","SUBCOMPONENTS","SUPPLIES"}, required = true)
        MaterialType materialType,

        @Schema(description = "ID del componente al que pertenece un subcomponente si es el caso", example = "1")
        Long componentId,

        @NotNull
        @Positive
        @Schema(description = "ID de la embarcación a la que pertenece el item", example = "1", required = true)
        Long vesselId

) {}
