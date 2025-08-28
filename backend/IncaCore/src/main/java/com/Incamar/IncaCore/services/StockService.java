package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.dtos.stock.StockRequesDto;
import com.Incamar.IncaCore.dtos.stock.StockResponseDto;
import com.Incamar.IncaCore.dtos.stock.StockUpdateDto;
import com.Incamar.IncaCore.enums.MovementType;
import com.Incamar.IncaCore.models.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StockService {
    StockResponseDto createStock(@Valid StockRequesDto stockRequesDto);

    StockResponseDto getStockById(Long id);

    void deleteById(Long id);

    Object getAllStock(Pageable pageable);

    Page<StockResponseDto> searchStockByNameOfItem(String nameItem, Pageable pageable);

    StockResponseDto editStock(Long id, @Valid StockUpdateDto stockUpdateDto);

    void updateStock(Long id, @NotNull(message = "El ID del ítem en el almacén es obligatorio") Long itemWarehouseId, @NotNull(message = "La cantidad es obligatoria") @Min(value = 1, message = "La cantidad debe ser mayor a 0") Long quantity, @NotNull(message = "El tipo de movimiento es obligatorio") MovementType movementType, User responsible);
}
