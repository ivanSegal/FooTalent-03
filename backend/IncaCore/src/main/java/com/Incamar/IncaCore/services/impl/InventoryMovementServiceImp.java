package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.inventory.InventoryMovementRequestDto;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.enums.MovementType;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.InventoryMovementMapper;
import com.Incamar.IncaCore.models.InventoryMovement;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.InventoryMovementRepository;
import com.Incamar.IncaCore.repositories.ItemWarehouseRepository;
import com.Incamar.IncaCore.services.AuthService;
import com.Incamar.IncaCore.services.EmailService;
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
    private final ItemWarehouseRepository itemWarehouseRepository;
    private final InventoryMovementMapper inventoryMovementMapper;
    private final AuthService authService;
    private final EmailService emailService;


    @Override
    public InventoryMovementResponseDto createInventory(InventoryMovementRequestDto inventoryMovementRequestDto) {
        User responsible = authService.getAuthenticatedUser().orElseThrow(()->new  ResourceNotFoundException("Usuario no encontrado."));
        ItemWarehouse itemWarehouse = itemWarehouseRepository.findById(inventoryMovementRequestDto.getItemWarehouseId())
                .orElseThrow(()->new ResourceNotFoundException("Item de almacen no encontrado."));
        if(inventoryMovementRequestDto.getMovementType().equals(MovementType.ENTRADA)) {
            itemWarehouseServiceImp.increaseStock(inventoryMovementRequestDto.getItemWarehouseId(), inventoryMovementRequestDto.getQuantity());
        } else {
            itemWarehouseServiceImp.decreaseStock(inventoryMovementRequestDto.getItemWarehouseId(), inventoryMovementRequestDto.getQuantity());
            if (itemWarehouse.getStock() <= itemWarehouse.getStockMin()) {
                emailService.sendStockAlertEmail(
                        responsible.getEmail(),
                        responsible.getEmployee().getFirstName() + " " + responsible.getEmployee().getLastName(),
                        itemWarehouse.getName(),
                        itemWarehouse.getStock(),
                        itemWarehouse.getStockMin()
                );
            }
        }
        InventoryMovement inventoryMovement = inventoryMovementMapper.toEntity(inventoryMovementRequestDto);
        inventoryMovement.setItemWarehouse(itemWarehouse);
        inventoryMovement.setResponsible(responsible);
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
