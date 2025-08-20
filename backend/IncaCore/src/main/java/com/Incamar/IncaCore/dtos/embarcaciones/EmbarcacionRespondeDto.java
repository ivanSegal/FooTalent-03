package com.Incamar.IncaCore.dtos.embarcaciones;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(
        name = "Embarcaciones.EmbarcacionResponseDto",
        description = "Datos de la embarcación"
)
public class EmbarcacionResponseDto {
    @Schema(
            description = "Identificador único en formato UUID",
            example = "123e4567-e89b-12d3-a456-426614174000"
    )
    private UUID uuid;

    @Schema(
            description = "Nombre de la embarcación",
            example = "Legunst"
    )
    private String name;

    @Schema(
            description = "Código de registro de la embarcación",
            example = "juan.perez_92"
    )
    private String vessel_registration_number;

    @Schema(
            description = "Modelo",
            example = ""
    )
    private String model;

    @Schema(
            description = "Código ISSM",
            example = ""
    )
    private String issm;

    @Schema(
            description = "Nombre de bandera o país de procedencia",
            example = "Venezuela"
    )
    private String flag;

    @Schema(
            description = "Distintivo de la embarcacion",
            example = ""
    )
    private String distinctive;

    @Schema(
            description = "Nombre del puerto de registro",
            example = "Puerto la Cruz"
    )
    private String registrationPort;

    @Schema(
            description = "Código RIF de la embarcación",
            example = "V-404603431"
    )
    private String rif;

    @Schema(
            description = "Uso de la embarcación",
            example = "Transporte"
    )
    private String use;

    @Schema(
            description = "Material de construcción",
            example = "Metal"
    )
    private String hullMaterial;

    @Schema(
            description = "Popa",
            example = "juan.perez_92"
    )
    private String stern;

    @Schema(
            description = "Tipo de combustible",
            example = "Gasolina"
    )
    private String fuelType;
}
