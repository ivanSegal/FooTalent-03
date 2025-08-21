package com.Incamar.IncaCore.dtos.warehouse;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WarehouseRequestDto {

    @Schema(
            description = "Nombre del almacén",
            example = "Depósito Central",
            minLength = 3,
            maxLength = 100,
            required = true
    )
    @NotBlank(message = "El nombre del almacén no puede estar vacío")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;

    @Schema(
            description = "Ubicación del almacén",
            example = "Buenos Aires - Zona Norte",
            minLength = 3,
            maxLength = 150,
            required = true
    )
    @NotBlank(message = "La ubicación no puede estar vacía")
    @Size(min = 3, max = 150, message = "La ubicación debe tener entre 3 y 150 caracteres")
    private String location;
}
