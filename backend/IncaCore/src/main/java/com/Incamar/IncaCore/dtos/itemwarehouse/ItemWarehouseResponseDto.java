package com.Incamar.IncaCore.dtos.itemwarehouse;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ItemWarehouseResponseDto {

    @Schema(description = "Identificador único del ítem", example = "1")
    private Long id;

    @Schema(description = "Nombre del ítem", example = "Tornillos de acero")
    private String name;

    @Schema(description = "Descripción del ítem", example = "Caja con 100 tornillos de 5cm")
    private String description;

    @Schema(description = "Cantidad actual en stock", example = "150")
    private Long stock;

    @Schema(description = "Cantidad mínima permitida antes de reposición", example = "20")
    private Long stockMin;

    @Schema(description = "Nombre del almacén al que pertenece el ítem", example = "Depósito Central")
    private String warehouseName;
}
