package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.activity.ActivityRequestDto;
import com.Incamar.IncaCore.dtos.activity.ActivityResponseDto;
import com.Incamar.IncaCore.enums.ActivityType;
import com.Incamar.IncaCore.models.Activity;
import com.Incamar.IncaCore.models.InventoryMovement;
import com.Incamar.IncaCore.models.MaintenanceOrder;
import com.Incamar.IncaCore.models.VesselItem;
import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {
    public Activity toEntity(ActivityRequestDto requestDto, MaintenanceOrder maintenanceOrder,
                             VesselItem  vesselItem, InventoryMovement  inventoryMovement) {
        Activity activity = new Activity();
        activity.setMaintenanceOrder(maintenanceOrder);
        activity.setActivityType(ActivityType.valueOf(requestDto.getActivityType()));
        activity.setVesselItem(vesselItem);
        activity.setInventoryMovement(inventoryMovement);
        activity.setDescription(requestDto.getDescription());
        return activity;
    }

    public ActivityResponseDto toDTO(Activity activity){
        ActivityResponseDto responseDto = new ActivityResponseDto();
        responseDto.setId(activity.getId());
        responseDto.setMaintenanceOrder(activity.getMaintenanceOrderSummary());
        responseDto.setActivityType(activity.getActivityType().toString());
        responseDto.setVesselItemName(activity.getVesselItem().getName());
        responseDto.setInventoryMovementId(activity.getInventoryMovement() != null?
                activity.getInventoryMovement().getId():null);
        responseDto.setDescription(activity.getDescription());
        return responseDto;
    }
}
