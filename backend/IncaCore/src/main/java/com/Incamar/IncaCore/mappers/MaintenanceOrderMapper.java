package com.Incamar.IncaCore.mappers;


import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderRequestDto;
import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderResponseDto;
import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.enums.MaintenanceType;
import com.Incamar.IncaCore.models.Vessel;
import com.Incamar.IncaCore.models.MaintenanceOrder;
import com.Incamar.IncaCore.models.User;
import org.springframework.stereotype.Component;

@Component
public class MaintenanceOrderMapper {
    public MaintenanceOrder toEntity(MaintenanceOrderRequestDto dto, Vessel vessel, User user) {
        MaintenanceOrder maintenanceOrder = new MaintenanceOrder();
        maintenanceOrder.setVessel(vessel);
        maintenanceOrder.setMaintenanceType(MaintenanceType.valueOf(dto.getMaintenanceType()));
        if (dto.getStatus() != null) {
            maintenanceOrder.setStatus(MaintenanceOrderStatus.valueOf(dto.getStatus()));// Se pone Solicitado si no se envió el estado
        }
        maintenanceOrder.setMaintenanceManager(user);
        maintenanceOrder.setIssuedAt(dto.getIssuedAt() != null ? dto.getIssuedAt() : maintenanceOrder.getIssuedAt());
        maintenanceOrder.setScheduledAt(dto.getScheduledAt());
        maintenanceOrder.setStartedAt(dto.getStartedAt());
        maintenanceOrder.setFinishedAt(dto.getFinishedAt());
        maintenanceOrder.setMaintenanceReason(dto.getMaintenanceReason());
        return maintenanceOrder;
    }


    public MaintenanceOrderResponseDto toDTO(MaintenanceOrder maintenanceOrder) {
        MaintenanceOrderResponseDto dto = new MaintenanceOrderResponseDto();
        dto.setId(maintenanceOrder.getId());
        dto.setVesselId(maintenanceOrder.getVessel().getId());
        dto.setVesselName(maintenanceOrder.getVessel().getName());
        dto.setMaintenanceType(maintenanceOrder.getMaintenanceType());
        dto.setStatus(maintenanceOrder.getStatus());
        dto.setMaintenanceManager(maintenanceOrder.getMaintenanceManager().getEmployee().getFirstName());
        dto.setIssuedAt(maintenanceOrder.getIssuedAt());
        dto.setScheduledAt(maintenanceOrder.getScheduledAt());
        dto.setStartedAt(maintenanceOrder.getStartedAt());
        dto.setFinishedAt(maintenanceOrder.getFinishedAt());
        dto.setMaintenanceReason(maintenanceOrder.getMaintenanceReason());
        return dto;
    }
}
