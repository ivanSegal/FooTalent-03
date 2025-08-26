package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.inventory.CreateInventoryMovementEndpointDoc;
import com.Incamar.IncaCore.documentation.inventory.DeleteInventoryMovementEndpointDoc;
import com.Incamar.IncaCore.documentation.inventory.GetAllInventoryMovementsEndpointDoc;
import com.Incamar.IncaCore.documentation.inventory.GetInventoryMovementByIdEndpointDoc;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementRequestDto;
import com.Incamar.IncaCore.dtos.inventory.InventoryMovementResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import com.Incamar.IncaCore.services.InventoryMovementService;
import com.Incamar.IncaCore.utils.ApiResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController("/inventory-movements")
public class IventoryMovementController {

    private final InventoryMovementService inventoryMovementService;

    @CreateInventoryMovementEndpointDoc
    @PostMapping("/create")
    public ApiResult<?> addMovement(@RequestBody @Valid InventoryMovementRequestDto inventoryMovementRequestDto) {
        InventoryMovementResponseDto responseDto = inventoryMovementService.createInventory(inventoryMovementRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(responseDto,"Movimiento de inventario creado correctamente.")).getBody();
    }

    @GetInventoryMovementByIdEndpointDoc
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<?>> getInventoryMovementById(@PathVariable Long id) {
        InventoryMovementResponseDto responseDto = inventoryMovementService.getInventoryMovementById(id);
        return ResponseEntity.ok(ApiResult.success(responseDto,"Movimiento de inventario obtenido exitosamente."));
    }

    @DeleteInventoryMovementEndpointDoc
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<?>> deleteInventoryMovement(@PathVariable Long id) {
        inventoryMovementService.deleteById(id);
        return ResponseEntity.ok(ApiResult.success("Movimiento de inventario eliminado exitosamente."));
    }


    @GetAllInventoryMovementsEndpointDoc
    @GetMapping
    public ResponseEntity<ApiResult<?>> getAllInventory(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(ApiResult.success(inventoryMovementService.getAllInventoryMovement(pageable),"Se visualizan exitosamente todos los movimientos de inventario."));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResult<?>> searchInventory(@RequestParam("nombre") String nameItem, @ParameterObject Pageable pageable) {
        Page<InventoryMovementResponseDto> result = inventoryMovementService.searchIventoryByName(nameItem, pageable);
        return ResponseEntity.ok(ApiResult.success(result,"Movimientos de inventario obtenidas exitosamente."));
    }


}
