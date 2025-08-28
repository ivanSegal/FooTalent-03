package com.Incamar.IncaCore.dtos.inventory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovementDetailsResponseDto {

    @Schema(description = "ID del ítem de almacén", example = "10")
    private Long itemWarehouseId;

    private String itemWarehouseName;

    @Schema(description = "Cantidad de stock afectado", example = "10")
    private Long quantity;


}
