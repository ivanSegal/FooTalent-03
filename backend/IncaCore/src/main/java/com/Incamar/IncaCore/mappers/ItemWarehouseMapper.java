package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseRequestDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseUpdateDto;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.Stock;
import com.Incamar.IncaCore.models.Warehouse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;


@Mapper(componentModel = "spring", uses = StockMapper.class)
public interface ItemWarehouseMapper {

    @Mapping(target = "id", ignore = true)
    ItemWarehouse toEntity(ItemWarehouseRequestDto requestDto);

    @Mapping(target = "stocks", source = "stocks")
    ItemWarehouseResponseDto toResponseDto(ItemWarehouse itemWarehouse, List<Stock> stocks);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(ItemWarehouseUpdateDto updateDto, @MappingTarget ItemWarehouse entity);
}
