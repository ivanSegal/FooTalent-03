package com.Incamar.IncaCore.dtos.stock;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StockResponseDto {
    private Long id;

    private Long stock;

    private Long stockMin;

    private Long warehouseId;
    private String warehouseName;

    private Long itemWarehouseId;
    private String itemWarehouseName;
}
