package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.ordenMantenimiento.MaintenanceOrderRequestDto;
import com.Incamar.IncaCore.dtos.ordenMantenimiento.MaintenanceOrderResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IMaintenanceOrderService {
    Page<MaintenanceOrderResponseDto> getAllMaintenanceOrders(Pageable pageable);
    MaintenanceOrderResponseDto getMaintenanceOrderById(Long id);
    MaintenanceOrderResponseDto createMaintenanceOrder(MaintenanceOrderRequestDto dto, JwtDataDto jwtDataDto);
    void deleteMaintenanceOrderById(Long id);
    MaintenanceOrderResponseDto editMaintenanceOrder(Long id,
                                                     MaintenanceOrderRequestDto maintenanceOrderRequestDto);
    Page<MaintenanceOrderResponseDto> searchMaintenanceOrderByVessel(String vesselName, Pageable pageable);
}
