package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseRequestDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseUpdateDto;
import com.Incamar.IncaCore.exceptions.ConflictException;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.ItemWarehouseMapper;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.repositories.ItemWarehouseRepository;
import com.Incamar.IncaCore.repositories.WarehouseRepository;
import com.Incamar.IncaCore.services.IItemWarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemWarehouseService implements IItemWarehouseService {

    private final ItemWarehouseMapper itemWarehouseMapper;
    private final ItemWarehouseRepository itemWarehouseRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    public ItemWarehouseResponseDto createItemWarehouse(ItemWarehouseRequestDto itemWarehouse) {
        if(warehouseRepository.existsById(itemWarehouse.getWarehouseId())) {
             throw  new ResourceNotFoundException("Almacen no encontrado con ID: " + itemWarehouse.getWarehouseId());
        }
        if(itemWarehouseRepository.existsItemWarehouseByName(itemWarehouse.getName())) {
            throw new ConflictException("Item de almacen ya existe con ese nombre.");
        }
        ItemWarehouse itemWarehouse1 = itemWarehouseMapper.toEntity(itemWarehouse);
        itemWarehouseRepository.save(itemWarehouse1);
        return itemWarehouseMapper.toResponseDto(itemWarehouse1);
    }

    @Override
    public ItemWarehouseResponseDto getItemWarehouseById(Long id) {
        ItemWarehouse itemWarehouse = itemWarehouseRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Item de almacen no encontrado con ID: " + id));
        return itemWarehouseMapper.toResponseDto(itemWarehouse);
    }

    @Override
    public void deleteById(Long id) {
        ItemWarehouse itemWarehouse = itemWarehouseRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Item de almacen no encontrado con ID: " + id));
        itemWarehouseRepository.delete(itemWarehouse);
    }

    @Override
    public ItemWarehouseResponseDto editWarehouse(Long id, ItemWarehouseUpdateDto itemWarehouseDto) {
        ItemWarehouse itemWarehouse = itemWarehouseRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Item de almacen no encontrado con ID: " + id));
        itemWarehouseMapper.updateEntityFromDto(itemWarehouseDto, itemWarehouse);
        itemWarehouseRepository.save(itemWarehouse);
        return itemWarehouseMapper.toResponseDto(itemWarehouse);
    }

    @Override
    public Page<ItemWarehouseResponseDto> getAllItemsWarehouse(Pageable pageable) {
        Page<ItemWarehouse> itemWarehousePage = itemWarehouseRepository.findAll(pageable);
        return itemWarehousePage.map(itemWarehouseMapper::toResponseDto);
    }

    @Override
    public Page<ItemWarehouseResponseDto> searchItemWarehouseByName(String nombre, Pageable pageable) {
        Page<ItemWarehouse> itemWarehousePage = itemWarehouseRepository.findByNameContainingIgnoreCase(nombre,  pageable);
        return itemWarehousePage.map(itemWarehouseMapper::toResponseDto);
    }

    @Transactional
    @Override
    public void increaseStock(Long itemWarehouseId, int quantity) {
        ItemWarehouse item = itemWarehouseRepository.findById(itemWarehouseId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con ID: " + itemWarehouseId));

        item.setStock(item.getStock() + quantity);
        itemWarehouseRepository.save(item);
    }

    @Transactional
    @Override
    public void decreaseStock(Long itemWarehouseId, int quantity) {
        ItemWarehouse item = itemWarehouseRepository.findById(itemWarehouseId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con ID: " + itemWarehouseId));

        if (item.getStock() < quantity) {
            throw new RuntimeException("Stock insuficiente para el ítem con ID: " + itemWarehouseId);
        }

        item.setStock(item.getStock() - quantity);
        itemWarehouseRepository.save(item);
    }
}
