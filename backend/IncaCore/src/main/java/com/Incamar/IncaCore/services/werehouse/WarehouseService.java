package com.Incamar.IncaCore.services.werehouse;


import com.Incamar.IncaCore.dtos.warehouse.WarehouseRequestDto;
import com.Incamar.IncaCore.dtos.warehouse.WarehouseResponseDto;
import com.Incamar.IncaCore.exceptions.BadRequestException;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.WarehouseMapper;
import com.Incamar.IncaCore.models.Warehouse;
import com.Incamar.IncaCore.repositories.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseService implements IWarehouseService {

    private WarehouseRepository warehouseRepository;

    @Override
    public WarehouseResponseDto create(WarehouseRequestDto warehouseRequestDto) {
        if (warehouseRepository.existsByName(warehouseRequestDto.getName())) {
            throw new BadRequestException("El nombre del almacen ya existe.");
        }
        Warehouse warehouse = WarehouseMapper.toEntity(warehouseRequestDto);
        warehouseRepository.save(warehouse);
        return WarehouseMapper.toDto(warehouse);
    }

    @Override
    public WarehouseResponseDto getWarehouseById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Almacen no encontrado."));
        return WarehouseMapper.toDto(warehouse);
    }

    @Override
    public void deleteById(Long id) {
        if (!warehouseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Almacen no encontrado.");
        }
        warehouseRepository.deleteById(id);
    }

    @Override
    public WarehouseResponseDto editWarehouse(Long id, WarehouseRequestDto warehouseRequestDto) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Almacen no encontrado."));
        WarehouseMapper.updateEntityFromDto(warehouseRequestDto, warehouse);
        warehouseRepository.save(warehouse);
        return WarehouseMapper.toDto(warehouse);
    }

    @Override
    public Page<WarehouseResponseDto> getAllWarehouse(Pageable pageable) {
        Page<Warehouse> warehousePage = warehouseRepository.findAll(pageable);
        return warehousePage.map(WarehouseMapper::toDto);
    }

    @Override
    public Page<WarehouseResponseDto> searchWarehouseByName(String name, Pageable pageable) {
        Page<Warehouse> warehouses= warehouseRepository.findByNameContainingIgnoreCase(name,  pageable);
        return warehouses.map(WarehouseMapper::toDto);
    }
}
