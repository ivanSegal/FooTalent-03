package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseRequestDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseUpdateDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface IItemWarehouseService {

    ItemWarehouseResponseDto createItemWarehouse(ItemWarehouseRequestDto itemWarehouse);

    ItemWarehouseResponseDto getItemWarehouseById(Long id);

    void deleteById(Long id);

    ItemWarehouseResponseDto editWarehouse(Long id, @Valid ItemWarehouseUpdateDto itemWarehouseDto);

    Page<ItemWarehouseResponseDto> getAllItemsWarehouse(Pageable pageable);

    Page<ItemWarehouseResponseDto> searchItemWarehouseByName(String nombre, Pageable pageable);

    @Transactional
    void increaseStock(Long itemWarehouseId, int quantity);

    @Transactional
    void decreaseStock(Long itemWarehouseId, int quantity);
}
