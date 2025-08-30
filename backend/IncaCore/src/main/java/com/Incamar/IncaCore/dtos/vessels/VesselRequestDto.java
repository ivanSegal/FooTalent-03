package com.Incamar.IncaCore.dtos.vessels;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VesselRequestDto {

    @NotBlank(message = "El nombre de la embarcación es obligatorio")
    @Size(max = 100)
    @Schema(description = "Nombre de la embarcación", example = "Titanic II", maxLength = 100, required = true)
    private String name;

    @NotBlank(message = "El número de matrícula es obligatorio")
    @Pattern(regexp = "^[A-Z0-9\\-]+$")
    @Schema(description = "Número de matrícula de la embarcación", example = "ABC-1234", pattern = "^[A-Z0-9\\-]+$", required = true)
    private String registrationNumber;

    @NotBlank(message = "El ISMM es obligatorio")
    @Pattern(
            regexp = "^(ISMM-[0-9]{3,6}|[0-9]{3,12})$",
            message = "El ISMM debe ser numérico o tener el formato ISMM-####"
    )
    @Schema(
            description = "Número ISMM de la embarcación. Puede ser numérico o en formato ISM-####",
            example = "ISMM-775991344",
            pattern = "^(ISMM-[0-9]{3,6}|[0-9]{3,12})$",
            required = true
    )
    private String ismm;

    @NotBlank(message = "El estado de bandera es obligatorio")
    @Size(max = 50)
    @Schema(description = "Estado de bandera de la embarcación", example = "Panamá", maxLength = 50, required = true)
    private String flagState;

    @NotBlank(message = "El distintivo es obligatorio")
    @Size(max = 20)
    @Schema(description = "Distintivo de la embarcación", example = "YYV-3742", maxLength = 20, required = true)
    private String callSign;

    @NotBlank(message = "El puerto de registro es obligatorio")
    @Size(max = 100)
    @Schema(description = "Puerto de registro de la embarcación", example = "Puerto Cabello", maxLength = 100, required = true)
    private String portOfRegistry;

    @NotBlank(message = "El RIF es obligatorio")
    @Pattern(regexp = "^[JGVEP]-\\d{8}-\\d$")
    @Schema(description = "RIF de la embarcación", example = "J-12345678-9", pattern = "^[JGVEP]-\\d{8}-\\d$", required = true)
    private String rif;

    @NotBlank(message = "El tipo de servicio es obligatorio")
    @Size(max = 50)
    @Schema(description = "Tipo de servicio de la embarcación", example = "Carga", maxLength = 50, required = true)
    private String serviceType;

    @NotBlank(message = "El material de construcción es obligatorio")
    @Size(max = 50)
    @Schema(description = "Material de construcción de la embarcación", example = "Acero", maxLength = 50, required = true)
    private String constructionMaterial;

    @NotBlank(message = "El tipo de popa es obligatorio")
    @Size(max = 50)
    @Schema(description = "Tipo de popa de la embarcación", example = "Popa abierta", maxLength = 50, required = true)
    private String sternType;

    @NotBlank(message = "El tipo de combustible es obligatorio")
    @Size(max = 50)
    @Schema(description = "Tipo de combustible de la embarcación", example = "Diesel", maxLength = 50, required = true)
    private String fuelType;

    @NotNull(message = "Las horas de navegación son obligatorias")
    @PositiveOrZero(message = "Las horas de navegación no pueden ser negativas")
    @Schema(description = "Horas de navegación de la embarcación", example = "12500.5", minimum = "0",required = true)
    private Double navigationHours;
}
