package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.maintenanceOrder.*;
import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderRequestDto;
import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderResponseDto;
import com.Incamar.IncaCore.security.CustomUserDetails;
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
@Tag(name = "06 - Ordenes de Mantenimiento", description = "Endpoints para la gestión de órdenes de mantenimiento de " +
        "embarcaciones")
public class MaintenanceOrderController {
    private final MaintenanceOrderService maintenanceOrderService;

    @GetAllMaintenanceOrdersEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','MAINTENANCE') ")
    @GetMapping
    public ResponseEntity<Page<MaintenanceOrderResponseDto>> getAllMaintenanceOrders(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(maintenanceOrderService.getAllMaintenanceOrders(pageable));
    }

    @GetMaintenanceOrderByIdEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','MAINTENANCE') ")
    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceOrderResponseDto> getMaintenanceOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceOrderService.getMaintenanceOrderById(id));
    }

    @CreateMaintenanceOrderEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','MAINTENANCE') ")
    @PostMapping
    public ResponseEntity<ApiResult<?>> createMaintenanceOrder(@Validated(MaintenanceOrderRequestDto.Create.class) @RequestBody MaintenanceOrderRequestDto requestDto
            , Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        MaintenanceOrderResponseDto createdOrder = maintenanceOrderService.createMaintenanceOrder(requestDto, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResult.success(createdOrder,
                "Orden de mantenimiento creada correctamente."));
    }

    @UpdateMaintenanceOrderEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE')")
    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceOrderResponseDto> updateMaintenanceOrder(@PathVariable Long id, @Valid @RequestBody MaintenanceOrderRequestDto requestDto) {
        MaintenanceOrderResponseDto updatedOrder = maintenanceOrderService.editMaintenanceOrder(id, requestDto);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMaintenanceOrderEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenanceOrder(@PathVariable Long id) {
        maintenanceOrderService.deleteMaintenanceOrderById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','MAINTENANCE') ")
    @SearchMaintenanceOrdersEndpointDoc
    @GetMapping("/search")
    public ResponseEntity<Page<MaintenanceOrderResponseDto>> searchMaintenanceOrderByVessel(@RequestParam(
            "vesselName") String vesselName,
                                                                  @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(maintenanceOrderService.searchMaintenanceOrderByVessel(vesselName, pageable));
    }

}
