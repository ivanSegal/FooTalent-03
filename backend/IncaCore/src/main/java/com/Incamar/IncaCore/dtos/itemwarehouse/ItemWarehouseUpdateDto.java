package com.Incamar.IncaCore.dtos.itemwarehouse;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @Schema(description = "Cantidad mínima permitida antes de reposición", example = "20")
    @NotBlank(message = "El stock minimo es obligatorio")
    private Long stockMin;

    @Schema(description = "ID del almacén al que pertenece el ítem", example = "1")
    @NotNull(message = "El ID del almacén es obligatorio")
    private Long warehouseId;
}
