package com.Incamar.IncaCore.dtos.itemwarehouse;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class StockSummaryDto {

    @Schema(description = "Identificador único del stock", example = "10")
    private Long stockId;

    @Schema(description = "Cantidad actual en stock", example = "150")
    private Long stock;

    private Long stockMin;

    @Schema(description = "Identificador del almacén", example = "1")
    private Long warehouseId;

    @Schema(description = "Nombre del almacén", example = "Depósito Central")
    private String warehouseName;
}
