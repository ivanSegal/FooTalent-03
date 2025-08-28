package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.warehouse.*;
import com.Incamar.IncaCore.dtos.warehouse.WarehouseRequestDto;
import com.Incamar.IncaCore.dtos.warehouse.WarehouseResponseDto;
import com.Incamar.IncaCore.services.WarehouseService;
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
@RequestMapping("/api/warehouses")
@Tag(name = "11 - Almacenes",
        description = "Endpoints para gestión de almacenes")
public class WarehouseController {

    private final WarehouseService warehouseService;

    @CreateWarehouseEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','INVENTORY')")
    @PostMapping("/create")
    public ResponseEntity<ApiResult<WarehouseResponseDto>> create(@Valid @RequestBody WarehouseRequestDto  warehouseRequestDto) {
        WarehouseResponseDto warehouseResponseDto = warehouseService.create(warehouseRequestDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResult.success(warehouseResponseDto,"Almacen creado correctamente"));
    }

    @GetWarehouseByIdEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','INVENTORY')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<?>> getWarehouseById(@PathVariable Long id) {
        WarehouseResponseDto warehouseResponseDto = warehouseService.getWarehouseById(id);
        return ResponseEntity.ok(ApiResult.success(warehouseResponseDto,"Almacen obtenido exitosamente."));
    }

    @DeleteWarehouseEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<?>> deleteWarehouse(@PathVariable Long id) {
        warehouseService.deleteById(id);
        return ResponseEntity.ok(ApiResult.success("Almacen eliminado exitosamente."));
    }

    @UpdateWarehouseEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<?>> editWarehouse(@PathVariable Long id,
                                                        @Valid @RequestBody WarehouseRequestDto warehouseRequestDto) {
        WarehouseResponseDto warehouseResponseDto =  warehouseService.editWarehouse(id, warehouseRequestDto);
        return ResponseEntity.ok(ApiResult.success(warehouseResponseDto,"Almacen editado exitosamente."));
    }

    @GetAllWarehousesEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','INVENTORY')")
    @GetMapping
    public ResponseEntity<ApiResult<?>> getAllWarehouse(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(ApiResult.success(warehouseService.getAllWarehouse(pageable),"Se visualizan exitosamente todas las embarcaciones."));
    }


    @SearchWarehousesEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','INVENTORY')")
    @GetMapping("/search")
    public ResponseEntity<ApiResult<?>> searchWarehouse(@RequestParam("nombre") String nombre, @ParameterObject Pageable pageable) {
        Page<WarehouseResponseDto> result = warehouseService.searchWarehouseByName(nombre, pageable);
        return ResponseEntity.ok(ApiResult.success(result,"Embarcaciones obtenidas exitosamente."));
    }

}
