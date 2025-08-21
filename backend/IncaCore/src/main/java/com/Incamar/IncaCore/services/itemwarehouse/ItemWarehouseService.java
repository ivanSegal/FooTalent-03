package com.Incamar.IncaCore.services.itemwarehouse;

import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseRequestDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseUpdateDto;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.ItemWarehouseMapper;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.repositories.ItemWarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemWarehouseService implements IItemWarehouseService{

    private final ItemWarehouseMapper itemWarehouseMapper;
    private final ItemWarehouseRepository itemWarehouseRepository;

    @Override
    public ItemWarehouseResponseDto createItemWarehouse(ItemWarehouseRequestDto itemWarehouse) {
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
}
