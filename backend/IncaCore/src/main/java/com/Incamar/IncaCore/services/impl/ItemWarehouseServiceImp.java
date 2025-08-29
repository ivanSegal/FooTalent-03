package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseRequestDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseUpdateDto;
import com.Incamar.IncaCore.dtos.warehouse.WarehouseRequestDto;
import com.Incamar.IncaCore.exceptions.ConflictException;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.ItemWarehouseMapper;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.Stock;
import com.Incamar.IncaCore.models.Warehouse;
import com.Incamar.IncaCore.repositories.ItemWarehouseRepository;
import com.Incamar.IncaCore.repositories.StockRepository;
import com.Incamar.IncaCore.repositories.WarehouseRepository;
import com.Incamar.IncaCore.services.IItemWarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemWarehouseServiceImp implements IItemWarehouseService {

    private final ItemWarehouseMapper itemWarehouseMapper;
    private final ItemWarehouseRepository itemWarehouseRepository;
    private final StockRepository stockRepository;

    @Override
    public ItemWarehouseResponseDto createItemWarehouse(ItemWarehouseRequestDto itemWarehouse) {
        if(itemWarehouseRepository.existsItemWarehouseByName(itemWarehouse.getName())) {
            throw new ConflictException("Item de almacen ya existe con ese nombre.");
        }
        ItemWarehouse item = itemWarehouseMapper.toEntity(itemWarehouse);
        itemWarehouseRepository.save(item);
        List<Stock> stocks = stockRepository.findByItemWarehouse(item);
        return itemWarehouseMapper.toResponseDto(item, stocks);
    }

    @Override
    public ItemWarehouseResponseDto getItemWarehouseById(Long id) {
        ItemWarehouse itemWarehouse = itemWarehouseRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Item de almacen no encontrado con ID: " + id));
        List<Stock> stocks = stockRepository.findByItemWarehouse(itemWarehouse);
        return itemWarehouseMapper.toResponseDto(itemWarehouse, stocks);
    }

    @Override
    public void deleteById(Long id) {
        ItemWarehouse itemWarehouse = itemWarehouseRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Item de almacen no encontrado con ID: " + id));
        itemWarehouseRepository.delete(itemWarehouse);
    }

    @Override
    public ItemWarehouseResponseDto editItemWarehouse(Long id, ItemWarehouseUpdateDto itemWarehouseDto) {
        ItemWarehouse itemWarehouse = itemWarehouseRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Item de almacen no encontrado con ID: " + id));
        if (itemWarehouseRepository.existsItemWarehouseByName(itemWarehouse.getName()) &&  !itemWarehouse.getName().equals(itemWarehouseDto.getName())) {
            throw new ConflictException("Item de almacen ya existe con ese nombre.");
        }
        itemWarehouseMapper.updateEntityFromDto(itemWarehouseDto, itemWarehouse);
        itemWarehouseRepository.save(itemWarehouse);
        List<Stock> stocks = stockRepository.findByItemWarehouse(itemWarehouse);
        return itemWarehouseMapper.toResponseDto(itemWarehouse, stocks);
    }

    @Override
    public Page<ItemWarehouseResponseDto> getAllItemsWarehouse(Pageable pageable) {
        Page<ItemWarehouse> itemWarehousePage = itemWarehouseRepository.findAll(pageable);
        return itemWarehousePage.map(itemWarehouse -> {
            List<Stock> stocks = stockRepository.findByItemWarehouse(itemWarehouse);
            return itemWarehouseMapper.toResponseDto(itemWarehouse, stocks);
        });
    }

    @Override
    public Page<ItemWarehouseResponseDto> searchItemWarehouseByName(String nombre, Pageable pageable) {
        Page<ItemWarehouse> itemWarehousePage = itemWarehouseRepository.findByNameContainingIgnoreCase(nombre,  pageable);
        return itemWarehousePage.map(itemWarehouse -> {
            List<Stock> stocks = stockRepository.findByItemWarehouse(itemWarehouse);
            return itemWarehouseMapper.toResponseDto(itemWarehouse, stocks);
        });
    }

}
