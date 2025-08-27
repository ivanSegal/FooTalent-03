package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.warehouse.WarehouseRequestDto;
import com.Incamar.IncaCore.dtos.warehouse.WarehouseResponseDto;
import com.Incamar.IncaCore.models.Warehouse;
import org.springframework.stereotype.Component;

@Component
public class WarehouseMapper {
    public static Warehouse toEntity(WarehouseRequestDto dto) {
        Warehouse warehouse = new Warehouse();
        warehouse.setName(dto.getName());
        warehouse.setLocation((dto.getLocation()));
        return warehouse;
    }

    public static WarehouseResponseDto toDto(Warehouse warehouse) {
        WarehouseResponseDto dto = new WarehouseResponseDto();
        dto.setId(warehouse.getId());
        dto.setName(warehouse.getName());
        dto.setLocation(warehouse.getLocation());
        return dto;
    }

    public static void updateEntityFromDto(WarehouseRequestDto dto, Warehouse warehouse) {
        warehouse.setName(dto.getName());
        warehouse.setLocation(dto.getLocation());
    }
}
