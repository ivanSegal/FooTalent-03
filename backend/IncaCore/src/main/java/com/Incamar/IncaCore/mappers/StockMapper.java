package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.itemwarehouse.StockSummaryDto;
import com.Incamar.IncaCore.dtos.stock.StockRequesDto;
import com.Incamar.IncaCore.dtos.stock.StockResponseDto;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.Stock;
import com.Incamar.IncaCore.models.Warehouse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StockMapper {

    @Mapping(target = "warehouse", source = "warehouse")
    @Mapping(target = "itemWarehouse", source = "itemWarehouse")
    @Mapping(target = "stock", source = "dto.stock")
    @Mapping(target = "stockMin", source = "dto.stockMin")
    @Mapping(target = "id", ignore = true)
    Stock toEntity(StockRequesDto dto, Warehouse warehouse, ItemWarehouse itemWarehouse);

    @Mapping(target = "id", expression = "java(stock.getId())")
    @Mapping(target = "stock", source = "stock")
    @Mapping(target = "stockMin", source = "stockMin")
    @Mapping(target = "warehouseId", source = "warehouse.id")
    @Mapping(target = "warehouseName", source = "warehouse.name")
    @Mapping(target = "itemWarehouseId", expression = "java(stock.getItemWarehouse().getId())")
    @Mapping(target = "itemWarehouseName", expression = "java(stock.getItemWarehouse().getName())")
    StockResponseDto toDto(Stock stock);

    @Mapping(target = "stockId", source = "id")
    @Mapping(target = "stock", source = "stock")
    @Mapping(target = "warehouseId", source = "warehouse.id")
    @Mapping(target = "warehouseName", source = "warehouse.name")
    StockSummaryDto toStockSummaryDto(Stock stock);
}
