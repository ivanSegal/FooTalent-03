package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.inventory.InventoryMovementRequestDto;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.dtos.inventory.MovementDetailsRequestDto;
import com.Incamar.IncaCore.dtos.inventory.MovementDetailsResponseDto;
import com.Incamar.IncaCore.models.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface InventoryMovementMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "warehouse", source = "warehouse")
    @Mapping(target = "responsible", source = "responsible")
    @Mapping(target = "movementType", source = "dto.movementType")
    @Mapping(target = "date", source = "dto.date")
    @Mapping(target = "reason", source = "dto.reason")
    InventoryMovement toEntity(InventoryMovementRequestDto dto, Warehouse warehouse, User responsible);

    default List<MovementDetails> toMovementDetailsEntities(
            List<MovementDetailsRequestDto> details,
            InventoryMovement inventoryMovement,
            Map<Long, ItemWarehouse> itemsById
    ) {
        return details.stream().map(d -> {
            MovementDetails md = new MovementDetails();
            md.setInventoryMovement(inventoryMovement);
            md.setItemWarehouse(itemsById.get(d.getItemWarehouseId()));
            md.setQuantity(d.getQuantity());
            return md;
        }).collect(Collectors.toList());
    }

    default InventoryMovementResponseDto toResponseDto(InventoryMovement inventoryMovement, List<MovementDetailsResponseDto> movementDetails) {
        InventoryMovementResponseDto dto = new InventoryMovementResponseDto();
        dto.setId(inventoryMovement.getId());
        dto.setWarehouseName(inventoryMovement.getWarehouse().getName());
        dto.setWarehouseId(inventoryMovement.getWarehouse().getId());
        dto.setMovementType(inventoryMovement.getMovementType());
        dto.setDate(inventoryMovement.getDate());
        dto.setReason(inventoryMovement.getReason());
        dto.setResponsibleId(inventoryMovement.getResponsible().getId());
        dto.setResponsibleName(
                inventoryMovement.getResponsible().getEmployee().getFirstName() + " " +
                        inventoryMovement.getResponsible().getEmployee().getLastName()
        );
        dto.setMovementDetails(movementDetails);
        return dto;
    }

}
