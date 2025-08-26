package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.inventory.InventoryMovementRequestDto;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.models.InventoryMovement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryMovementMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "itemWarehouse", expression = "java(mapItemWarehouse(requestDto.getItemWarehouseId()))")
    @Mapping(target = "responsible", expression = "java(mapUser(requestDto.getResponsibleId()))")
    InventoryMovement toEntity(InventoryMovementRequestDto requestDto);

    @Mapping(target = "itemWarehouseId", source = "itemWarehouse.id")
    @Mapping(target = "itemWarehouseName", source = "itemWarehouse.name")
    @Mapping(target = "responsibleId", source = "responsible.id")
    @Mapping(target = "responsibleName", source = "responsible.name")
    InventoryMovementResponseDto toResponseDto(InventoryMovement movement);
}
