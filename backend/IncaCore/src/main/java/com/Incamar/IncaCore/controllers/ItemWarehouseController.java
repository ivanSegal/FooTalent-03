package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.itemwarehouse.*;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseRequestDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseResponseDto;
import com.Incamar.IncaCore.dtos.itemwarehouse.ItemWarehouseUpdateDto;
import com.Incamar.IncaCore.services.IItemWarehouseService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/items/warehouses")
@Tag(name = "12 - Items de Almacen",
        description = "Endpoints para gestión de items de almacen.")
public class ItemWarehouseController {

    private final IItemWarehouseService itemWarehouseService;

    @CreateItemWarehouseEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','INVENTORY')")
    @PostMapping("/create")
    public ApiResult<?> createItemWarehouse(@RequestBody @Valid ItemWarehouseRequestDto itemWarehouse) {
        ItemWarehouseResponseDto  itemWarehouseResponseDto = itemWarehouseService.createItemWarehouse(itemWarehouse);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(itemWarehouseResponseDto,"Item de almacen creado correctamente.")).getBody();
    }

    @GetItemWarehouseByIdEndpointDoc
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<?>> getItemWarehouseById(@PathVariable Long id) {
        ItemWarehouseResponseDto itemWarehouseResponseDto = itemWarehouseService.getItemWarehouseById(id);
        return ResponseEntity.ok(ApiResult.success(itemWarehouseResponseDto,"Item de almacen obtenido exitosamente."));
    }

    @DeleteItemWarehouseEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<?>> deleteItemWarehouse(@PathVariable Long id) {
        itemWarehouseService.deleteById(id);
        return ResponseEntity.ok(ApiResult.success("Item de almacen eliminado exitosamente."));
    }

    @UpdateItemWarehouseEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<?>> editItemWarehouse(@PathVariable Long id,
                                                      @Valid @RequestBody ItemWarehouseUpdateDto itemWarehouseDto) {
        ItemWarehouseResponseDto itemWarehouseResponseDto =  itemWarehouseService.editItemWarehouse(id, itemWarehouseDto);
        return ResponseEntity.ok(ApiResult.success(itemWarehouseResponseDto,"Item de almacen editado exitosamente."));
    }

    @GetAllItemWarehousesEndpointDoc
    @GetMapping
    public ResponseEntity<ApiResult<?>> getAllItemsWarehouse(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(ApiResult.success(itemWarehouseService.getAllItemsWarehouse(pageable),"Se visualizan exitosamente todos los items de almacen."));
    }

    @SearchItemWarehouseEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','INVENTORY')")
    @GetMapping("/search")
    public ResponseEntity<ApiResult<?>> searchItemWarehouse(@RequestParam("nombre") String nombre, @ParameterObject Pageable pageable) {
        Page<ItemWarehouseResponseDto> result = itemWarehouseService.searchItemWarehouseByName(nombre, pageable);
        return ResponseEntity.ok(ApiResult.success(result,"Items de almacenamiento obtenidos exitosamente."));
    }
}
