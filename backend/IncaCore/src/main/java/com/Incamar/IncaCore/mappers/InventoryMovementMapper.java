package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.inventory.InventoryMovementRequestDto;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.models.InventoryMovement;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface InventoryMovementMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "itemWarehouse", expression = "java(mapItemWarehouse(requestDto.getItemWarehouseId()))")
    InventoryMovement toEntity(InventoryMovementRequestDto requestDto);

    @Mapping(target = "itemWarehouseId", source = "itemWarehouse.id")
    @Mapping(target = "itemWarehouseName", source = "itemWarehouse.name")
    @Mapping(target = "responsibleId", source = "responsible.id")
    @Mapping(target = "responsibleName",
            expression = "java(movement.getResponsible() != null && movement.getResponsible().getEmployee() != null ? movement.getResponsible().getEmployee().getFirstName() + \" \" + movement.getResponsible().getEmployee().getLastName() : null)")
    InventoryMovementResponseDto toResponseDto(InventoryMovement movement);

    default ItemWarehouse mapItemWarehouse(Long id) {
        if (id == null) return null;
        ItemWarehouse iw = new ItemWarehouse();
        iw.setId(id);
        return iw;
    }

}
