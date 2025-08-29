package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.stock.StockRequesDto;
import com.Incamar.IncaCore.dtos.stock.StockResponseDto;
import com.Incamar.IncaCore.dtos.stock.StockUpdateDto;
import com.Incamar.IncaCore.enums.MovementType;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.StockMapper;
import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.Stock;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.models.Warehouse;
import com.Incamar.IncaCore.repositories.ItemWarehouseRepository;
import com.Incamar.IncaCore.repositories.StockRepository;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.repositories.WarehouseRepository;
import com.Incamar.IncaCore.services.EmailService;
import com.Incamar.IncaCore.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class StockServiceImp implements StockService {

    private final WarehouseRepository warehouseRepository;
    private final ItemWarehouseRepository itemWarehouseRepository;
    private final StockMapper stockMapper;
    private final StockRepository stockRepository;
    private final EmailService emailService;

    @Override
    public StockResponseDto createStock(StockRequesDto stockRequesDto) {
        Warehouse warehouse = warehouseRepository.findById(stockRequesDto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Almacen no encontrado"));
        ItemWarehouse itemWarehouse = itemWarehouseRepository.
                findById(stockRequesDto.getItemWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Item de almacen no encontrado"));
        if (stockRepository.existsByItemWarehouseAndWarehouse(itemWarehouse, warehouse)) {
            throw new IllegalStateException("Ya existe un stock para ese ítem en ese almacén");
        }
        Stock stock = stockMapper.toEntity(stockRequesDto, warehouse, itemWarehouse);
        stockRepository.save(stock);
        return stockMapper.toDto(stock);
    }

    @Override
    public StockResponseDto getStockById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock no encontrado."));
        return stockMapper.toDto(stock);
    }

    @Override
    public void deleteById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock no encontrado."));
        stockRepository.delete(stock);
    }

    @Override
    public Page<StockResponseDto> getAllStock(Pageable pageable) {
        return stockRepository.findAll(pageable).map(stockMapper::toDto);
    }

    @Override
    public Page<StockResponseDto> searchStockByNameOfItem(String nameItem, Pageable pageable) {
        Page<Stock> stocks = stockRepository.findByItemWarehouse_NameContainingIgnoreCase(nameItem, pageable);
        return stocks.map(stockMapper::toDto);
    }

    @Override
    public StockResponseDto editStock(Long id, StockUpdateDto stockUpdateDto) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock no encontrado."));
        stock.setStockMin(stockUpdateDto.getStockMin());
        stockRepository.save(stock);
        return stockMapper.toDto(stock);
    }

    @Override
    public void updateStock( Long warehouseId, Long itemWarehouseId, Long quantity, MovementType movementType, User responsible) {
        Stock stock = stockRepository.findByWarehouseIdAndItemWarehouseId(warehouseId, itemWarehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock no encontrado"));

        if (movementType == MovementType.ENTRADA) {
            stock.setStock(stock.getStock() + quantity);
        } else {
            stock.setStock(stock.getStock() - quantity);
            if (stock.getStock() <= stock.getStockMin()) {
                emailService.sendStockAlertEmail(
                        responsible.getEmail(),
                        responsible.getEmployee().getFirstName() + " " + responsible.getEmployee().getLastName(),
                        stock.getItemWarehouse().getName(),
                        stock.getStock(),
                        stock.getWarehouse().getName(),
                        stock.getStockMin()
                );
            }
        }

        stockRepository.save(stock);
    }
}
