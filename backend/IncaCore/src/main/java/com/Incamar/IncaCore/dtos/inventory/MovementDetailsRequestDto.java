package com.Incamar.IncaCore.dtos.inventory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovementDetailsRequestDto {

    @Schema(description = "ID del ítem en el almacén", example = "10")
    @NotNull(message = "El ID del ítem en el almacén es obligatorio")
    private Long itemWarehouseId;

    @Schema(description = "Cantidad de ítems a mover", example = "50")
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Long quantity;
}
