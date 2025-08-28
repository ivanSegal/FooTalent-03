package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.inventory.InventoryMovementRequestDto;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.dtos.inventory.MovementDetailsRequestDto;
import com.Incamar.IncaCore.dtos.inventory.MovementDetailsResponseDto;
import com.Incamar.IncaCore.enums.MovementType;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.InventoryMovementMapper;
import com.Incamar.IncaCore.models.*;
import com.Incamar.IncaCore.repositories.*;
import com.Incamar.IncaCore.services.AuthService;
import com.Incamar.IncaCore.services.InventoryMovementService;
import com.Incamar.IncaCore.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class  InventoryMovementServiceImp implements InventoryMovementService {

    private final InventoryMovementRepository inventoryMovementRepository;
    private final ItemWarehouseRepository itemWarehouseRepository;
    private final InventoryMovementMapper inventoryMovementMapper;
    private final AuthService authService;
    private final WarehouseRepository warehouseRepository;
    private final MovementDetailsRepository movementDetailsRepository;
    private final StockService stockService;


    @Override
    public InventoryMovementResponseDto createInventory(InventoryMovementRequestDto requestDto) {
        User responsible = authService.getAuthenticatedUser()
                .orElseThrow(()->new  ResourceNotFoundException("Usuario no encontrado."));

        Warehouse warehouse = warehouseRepository.findById(requestDto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Almacén no encontrado."));

        InventoryMovement inventoryMovement = inventoryMovementMapper.toEntity(requestDto, warehouse, responsible);
        inventoryMovementRepository.save(inventoryMovement);


        Map<Long, ItemWarehouse> itemsById = itemWarehouseRepository.findAllById(
                requestDto.getMovementDetails().stream()
                        .map(MovementDetailsRequestDto::getItemWarehouseId)
                        .toList()
        ).stream().collect(Collectors.toMap(ItemWarehouse::getId, Function.identity()));

        List<MovementDetails> movementDetails = new ArrayList<>();
        for (MovementDetailsRequestDto detail : requestDto.getMovementDetails()) {
            stockService.updateStock(
                    warehouse.getId(),
                    detail.getItemWarehouseId(),
                    detail.getQuantity(),
                    requestDto.getMovementType(),
                    responsible
            );

            MovementDetails md = new MovementDetails();
            md.setInventoryMovement(inventoryMovement);
            md.setItemWarehouse(itemsById.get(detail.getItemWarehouseId()));
            md.setQuantity(detail.getQuantity());
            movementDetails.add(md);
        }

        movementDetailsRepository.saveAll(movementDetails);

        List<MovementDetailsResponseDto> responseDetails = movementDetails.stream().map(md -> {
            MovementDetailsResponseDto mdDto = new MovementDetailsResponseDto();
            mdDto.setItemWarehouseId(md.getItemWarehouse().getId());
            mdDto.setItemWarehouseName(md.getItemWarehouse().getName());
            mdDto.setQuantity(md.getQuantity());
            return mdDto;
        }).toList();

        return inventoryMovementMapper.toResponseDto(inventoryMovement, responseDetails);
    }

    @Override
    public InventoryMovementResponseDto getInventoryMovementById(Long id) {
        InventoryMovement inventoryMovement = inventoryMovementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario no encontrado con id: " + id));
        List<MovementDetails> movementDetails = movementDetailsRepository.findByInventoryMovementId(id);

        List<MovementDetailsResponseDto> movementDetailsDto = movementDetails.stream().map(md -> {
            MovementDetailsResponseDto dto = new MovementDetailsResponseDto();
            dto.setItemWarehouseId(md.getItemWarehouse().getId());
            dto.setItemWarehouseName(md.getItemWarehouse().getName());
            dto.setQuantity(md.getQuantity());
            return dto;
        }).toList();

        return inventoryMovementMapper.toResponseDto(inventoryMovement, movementDetailsDto);
    }

    @Override
    public void deleteById(Long id) {
        InventoryMovement inventoryMovement = inventoryMovementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario no encontrado con id: " + id));
        List<MovementDetails> movementDetails = movementDetailsRepository.findByInventoryMovementId(id);

        for (MovementDetails detail : movementDetails) {
            Long warehouseId = inventoryMovement.getWarehouse().getId();
            Long itemWarehouseId = detail.getItemWarehouse().getId();
            Long quantity = detail.getQuantity();
            if (inventoryMovement.getMovementType() == MovementType.ENTRADA) {
                stockService.updateStock(warehouseId, itemWarehouseId, quantity, MovementType.SALIDA, inventoryMovement.getResponsible());
            } else if (inventoryMovement.getMovementType() == MovementType.SALIDA) {
                stockService.updateStock(warehouseId, itemWarehouseId, quantity, MovementType.ENTRADA, inventoryMovement.getResponsible());
            }
        }
        movementDetailsRepository.deleteAll(movementDetails);
        inventoryMovementRepository.delete(inventoryMovement);
    }

    @Override
    public Page<InventoryMovementResponseDto> getAllInventoryMovement(Pageable pageable) {
        Page<InventoryMovement> page = inventoryMovementRepository.findAll(pageable);
        return page.map(movement -> {
            List<MovementDetails> details = movementDetailsRepository.findByInventoryMovementId(movement.getId());

            List<MovementDetailsResponseDto> detailsDto = details.stream().map(md -> {
                MovementDetailsResponseDto dto = new MovementDetailsResponseDto();
                dto.setItemWarehouseId(md.getItemWarehouse().getId());
                dto.setItemWarehouseName(md.getItemWarehouse().getName());
                dto.setQuantity(md.getQuantity());
                return dto;
            }).toList();

            return inventoryMovementMapper.toResponseDto(movement, detailsDto);
        });
    }

    @Override
    public Page<InventoryMovementResponseDto> searchIventoryByName(String nameItem, Pageable pageable) {
        Page<InventoryMovement> page = inventoryMovementRepository
                .findByItemWarehouseName(nameItem, pageable);

        return page.map(movement -> {
            List<MovementDetails> details = movementDetailsRepository.findByInventoryMovementId(movement.getId());

            List<MovementDetailsResponseDto> detailsDto = details.stream().map(md -> {
                MovementDetailsResponseDto dto = new MovementDetailsResponseDto();
                dto.setItemWarehouseId(md.getItemWarehouse().getId());
                dto.setItemWarehouseName(md.getItemWarehouse().getName());
                dto.setQuantity(md.getQuantity());
                return dto;
            }).toList();

            return inventoryMovementMapper.toResponseDto(movement, detailsDto);
        });
    }


}
