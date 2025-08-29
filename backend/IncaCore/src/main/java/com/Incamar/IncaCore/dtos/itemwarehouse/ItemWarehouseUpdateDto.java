package com.Incamar.IncaCore.dtos.itemwarehouse;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ItemWarehouseUpdateDto {

    @Schema(description = "Nombre único del ítem", example = "Tornillos de acero")
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @Schema(description = "Descripción del ítem", example = "Caja con 100 tornillos de 5cm")
    @NotBlank(message = "La descripción es obligatoria")
    private String description;

}
