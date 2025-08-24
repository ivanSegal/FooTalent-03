package com.Incamar.IncaCore.dtos.vesselItem;

import com.Incamar.IncaCore.enums.ControlType;
import com.Incamar.IncaCore.enums.MaterialType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record VesselItemUpdateReq(

        @Schema(description = "Nombre del item", example = "Motor de propulsión principal")
        @NotBlank
        String name,

        @Schema(description = "Descripción del item", example = "Motor diesel Caterpillar serie 3500")
        String description,

        @Min(value = 0, message = "Las horas de vida útil deben ser mayores o iguales a 0")
        @Schema(description = "Horas de vida útil", example = "20000")
        Integer usefulLifeHours,

        @Min(value = 0, message = "Las horas de alerta deben ser mayores o iguales a 0")
        @Schema(description = "Horas de alerta", example = "18000")
        Integer alertHours,

        @Schema(description = "Tipo de control aplicado al item", example = "NAVIGATION",allowableValues = {"NAVIGATION","OWN"})
        ControlType controlType,

        @Schema(description = "Tipo de material del item", example = "COMPONENTS", allowableValues = {"COMPONENTS","SUBCOMPONENTS","SUPPLIES"})
        MaterialType materialType,

        @Schema(description = "ID del componente padre (si es un subcomponente)", example = "5")
        Long componentId,

        @Schema(description = "ID de la embarcación a la que pertenece", example = "2")
        Long vesselId

) {
}
