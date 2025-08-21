package com.Incamar.IncaCore.services.werehouse;

import com.Incamar.IncaCore.dtos.warehouse.WarehouseRequestDto;
import com.Incamar.IncaCore.dtos.warehouse.WarehouseResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;



public interface IWarehouseService {

   WarehouseResponseDto create(WarehouseRequestDto warehouseRequestDto);
   WarehouseResponseDto getWarehouseById(Long id);
    void deleteById(Long id);
    WarehouseResponseDto editWarehouse(Long id, WarehouseRequestDto warehouseRequestDto);
    Page<WarehouseResponseDto> getAllWarehouse(Pageable pageable);
    Page<WarehouseResponseDto> searchWarehouseByName(String nombre, Pageable pageable);
}
