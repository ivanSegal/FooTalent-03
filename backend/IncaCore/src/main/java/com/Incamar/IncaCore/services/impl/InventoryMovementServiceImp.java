package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.inventory.InventoryMovementRequestDto;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.enums.MovementType;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.InventoryMovementMapper;
import com.Incamar.IncaCore.models.InventoryMovement;
import com.Incamar.IncaCore.repositories.InventoryMovementRepository;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.services.InventoryMovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class  InventoryMovementServiceImp implements InventoryMovementService {

    private final InventoryMovementRepository inventoryMovementRepository;
    private final ItemWarehouseServiceImp itemWarehouseServiceImp;
    private final InventoryMovementMapper inventoryMovementMapper;
    private final UserRepository userRepository;


    @Override
    public InventoryMovementResponseDto createInventory(InventoryMovementRequestDto inventoryMovementRequestDto) {
        if (!userRepository.existsById(inventoryMovementRequestDto.getResponsibleId())) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + inventoryMovementRequestDto.getResponsibleId());
        }
        if(inventoryMovementRequestDto.getMovementType().equals(MovementType.ENTRADA)) {
            itemWarehouseServiceImp.increaseStock(inventoryMovementRequestDto.getItemWarehouseId(), inventoryMovementRequestDto.getQuantity());
        } else {
            itemWarehouseServiceImp.decreaseStock(inventoryMovementRequestDto.getItemWarehouseId(), inventoryMovementRequestDto.getQuantity());
        }
        InventoryMovement inventoryMovement = inventoryMovementMapper.toEntity(inventoryMovementRequestDto);
        inventoryMovementRepository.save(inventoryMovement);
        return inventoryMovementMapper.toResponseDto(inventoryMovement);
    }

    @Override
    public InventoryMovementResponseDto getInventoryMovementById(Long id) {
        InventoryMovement inventoryMovement = inventoryMovementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario no encontrado con id: " + id));
        return inventoryMovementMapper.toResponseDto(inventoryMovement);
    }

    @Override
    public void deleteById(Long id) {
        InventoryMovement inventoryMovement = inventoryMovementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario no encontrado con id: " + id));
        inventoryMovementRepository.delete(inventoryMovement);
    }

    @Override
    public Page<InventoryMovementResponseDto> getAllInventoryMovement(Pageable pageable) {
        Page<InventoryMovement> inventoryMovementPage = inventoryMovementRepository.findAll(pageable);
        return inventoryMovementPage.map(inventoryMovementMapper::toResponseDto);
    }

    @Override
    public Page<InventoryMovementResponseDto> searchIventoryByName(String nameItem, Pageable pageable) {
        Page<InventoryMovement> page = inventoryMovementRepository
                .findByItemWarehouse_NameContainingIgnoreCase(nameItem, pageable);

        return page.map(inventoryMovementMapper::toResponseDto);
    }


}
