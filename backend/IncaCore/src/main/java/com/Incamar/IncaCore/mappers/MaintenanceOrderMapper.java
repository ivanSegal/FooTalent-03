package com.Incamar.IncaCore.mappers;


import com.Incamar.IncaCore.dtos.ordenMantenimiento.MaintenanceOrderRequestDto;
import com.Incamar.IncaCore.dtos.ordenMantenimiento.MaintenanceOrderResponseDto;
import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.enums.MaintenanceType;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.models.MaintenanceOrder;
import com.Incamar.IncaCore.models.User;
import org.springframework.stereotype.Component;

@Component
public class MaintenanceOrderMapper {

    public MaintenanceOrder toEntity(MaintenanceOrderRequestDto dto, Embarcacion embarcacion, User user) {
        MaintenanceOrder maintenanceOrder = new MaintenanceOrder();
        maintenanceOrder.setEmbarcacion(embarcacion);
        maintenanceOrder.setMaintenanceType(MaintenanceType.valueOf(dto.getTipoMantenimiento()));
        if (dto.getEstado() != null) {
            maintenanceOrder.setMaintenanceOrderStatus(MaintenanceOrderStatus.valueOf(dto.getEstado()));// Se pone Solicitado si no se envió el estado
        }
        maintenanceOrder.setMaintenanceManager(user);
        maintenanceOrder.setIssuedAt(dto.getFechaEmision() != null ? dto.getFechaEmision() : maintenanceOrder.getIssuedAt());
        maintenanceOrder.setScheduledAt(dto.getFechaProgramada());
        maintenanceOrder.setStartedAt(dto.getFechaInicio());
        maintenanceOrder.setFinishedAt(dto.getFechaFin());
        maintenanceOrder.setMaintenanceReason(dto.getMotivoMantenimiento());
        return maintenanceOrder;
    }

    public MaintenanceOrderResponseDto toDTO(MaintenanceOrder maintenanceOrder) {
        MaintenanceOrderResponseDto dto = new MaintenanceOrderResponseDto();
        dto.setId(maintenanceOrder.getId());
        dto.setEmbarcacionNombre(maintenanceOrder.getEmbarcacion().getNombre());
        dto.setMaintenanceType(maintenanceOrder.getMaintenanceType());
        dto.setMaintenanceOrderStatus(maintenanceOrder.getMaintenanceOrderStatus());
        dto.setMaintenanceManagerUsername(maintenanceOrder.getMaintenanceManager().getUsername());
        dto.setIssuedAt(maintenanceOrder.getIssuedAt());
        dto.setScheduledAt(maintenanceOrder.getScheduledAt());
        dto.setStartedAt(maintenanceOrder.getStartedAt());
        dto.setFinishedAt(maintenanceOrder.getFinishedAt());
        dto.setMaintenanceReason(maintenanceOrder.getMaintenanceReason());
        return dto;
    }
}
