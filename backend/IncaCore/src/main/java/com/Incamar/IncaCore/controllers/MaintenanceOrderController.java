package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.maintenanceOrder.*;
import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderRequestDto;
import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.services.MaintenanceOrderService;
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
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenes-mantenimiento")
@RequiredArgsConstructor
@Tag(name = "04 - Ordenes de Mantenimiento", description = "Endpoints para la gestión de órdenes de mantenimiento de " +
        "embarcaciones")
public class MaintenanceOrderController {
    private final MaintenanceOrderService maintenanceOrderService;

    @GetAllMaintenanceOrdersEndpointDoc
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PATRON', 'ADMINISTRATIVO', 'ADMIN')")
    @GetMapping
    public ResponseEntity<Page<MaintenanceOrderResponseDto>> getAllMaintenanceOrders(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(maintenanceOrderService.getAllMaintenanceOrders(pageable));
    }

    @GetMaintenanceOrderByIdEndpointDoc
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PATRON', 'ADMINISTRATIVO', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceOrderResponseDto> getMaintenanceOrderById(@PathVariable Long id) {
        MaintenanceOrderResponseDto MaintenanceOrder = maintenanceOrderService.getMaintenanceOrderById(id);
        if(MaintenanceOrder !=null) {
            return ResponseEntity.ok(MaintenanceOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CreateMaintenanceOrderEndpointDoc
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMINISTRATIVO', 'ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResult<?>> createMaintenanceOrder(@Validated(MaintenanceOrderRequestDto.Create.class) @RequestBody MaintenanceOrderRequestDto dto
            , Authentication authentication) {
        JwtDataDto jwtDataDto = (JwtDataDto) authentication.getPrincipal();
        MaintenanceOrderResponseDto createdOrden = maintenanceOrderService.createMaintenanceOrder(dto, jwtDataDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResult.success(createdOrden,
                "Orden de mantenimiento creada correctamente."));
    }

    @DeleteMaintenanceOrderEndpointDoc
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMINISTRATIVO', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMaintenanceOrder(@PathVariable Long id) {
        maintenanceOrderService.deleteMaintenanceOrderById(id);
        return ResponseEntity.noContent().build();
    }

    @UpdateMaintenanceOrderEndpointDoc
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMINISTRATIVO', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> editMaintenanceOrder(@PathVariable Long id, @Valid @RequestBody MaintenanceOrderRequestDto dto) {
        MaintenanceOrderResponseDto updatedOrden = maintenanceOrderService.editMaintenanceOrder(id, dto);
        return ResponseEntity.ok(updatedOrden);
    }

    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PATRON', 'ADMINISTRATIVO', 'ADMIN')")
    @SearchMaintenanceOrdersEndpointDoc
    @GetMapping("/search")
    public ResponseEntity<Page<?>> searchMaintenanceOrderByVessel(@RequestParam("nombre") String vesselName,
                                                                  @ParameterObject Pageable pageable) {
        Page<MaintenanceOrderResponseDto> result = maintenanceOrderService.searchMaintenanceOrderByVessel(vesselName, pageable);
        return ResponseEntity.ok(result);
    }

}
