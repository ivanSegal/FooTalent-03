package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.inventory.InventoryMovementRequestDto;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InventoryMovementService {
    InventoryMovementResponseDto createInventory(@Valid InventoryMovementRequestDto inventoryMovementRequestDto);

    InventoryMovementResponseDto getInventoryMovementById(Long id);

    void deleteById(Long id);

    Object getAllInventoryMovement(Pageable pageable);

    Page<InventoryMovementResponseDto> searchIventoryByName(String nameItem, Pageable pageable);
}
