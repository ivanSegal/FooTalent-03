package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseRequestDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseUpdateDto;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.Warehouse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface ItemWarehouseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "warehouse", expression = "java(mapWarehouse(requestDto.getWarehouseId()))")
    ItemWarehouse toEntity(ItemWarehouseRequestDto requestDto);


    @Mapping(target = "warehouseName", source = "warehouse.name")
    ItemWarehouseResponseDto toResponseDto(ItemWarehouse itemWarehouse);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    void updateEntityFromDto(ItemWarehouseUpdateDto updateDto, @MappingTarget ItemWarehouse entity);

    default Warehouse mapWarehouse(Long warehouseId) {
        if (warehouseId == null) {
            return null;
        }
        Warehouse warehouse = new Warehouse();
        warehouse.setId(warehouseId);
        return warehouse;
    }
}
