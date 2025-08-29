package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.activity.ActivityRequestDto;
import com.Incamar.IncaCore.dtos.activity.ActivityResponseDto;
import com.Incamar.IncaCore.enums.ActivityType;
import com.Incamar.IncaCore.models.Activity;
import com.Incamar.IncaCore.models.InventoryMovement;
import com.Incamar.IncaCore.models.MaintenanceOrder;
import com.Incamar.IncaCore.models.VesselItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ActivityMapper {
    public Activity toEntity(ActivityRequestDto requestDto, MaintenanceOrder maintenanceOrder,
                             VesselItem  vesselItem, List<InventoryMovement> inventoryMovement) {
        Activity activity = new Activity();
        activity.setMaintenanceOrder(maintenanceOrder);
        activity.setActivityType(ActivityType.valueOf(requestDto.getActivityType()));
        activity.setVesselItem(vesselItem);
        activity.setInventoryMovements(inventoryMovement);
        activity.setDescription(requestDto.getDescription());
        return activity;
    }

    public ActivityResponseDto toDTO(Activity activity){
        ActivityResponseDto responseDto = new ActivityResponseDto();
        responseDto.setId(activity.getId());
        responseDto.setMaintenanceOrderId(activity.getMaintenanceOrder().getId());
        responseDto.setMaintenanceOrder(activity.getMaintenanceOrderSummary());
        responseDto.setActivityType(activity.getActivityType().toString());
        responseDto.setVesselItemId(activity.getVesselItem().getId());
        responseDto.setVesselItemName(activity.getVesselItem().getName());
        // lista de IDs de movimientos
        if (activity.getInventoryMovements() != null) {
            List<Long> movementIds = activity.getInventoryMovements()
                    .stream()
                    .map(InventoryMovement::getId)
                    .toList();
            responseDto.setInventoryMovementsIds(movementIds);
        }
        responseDto.setDescription(activity.getDescription());
        return responseDto;
    }
}
