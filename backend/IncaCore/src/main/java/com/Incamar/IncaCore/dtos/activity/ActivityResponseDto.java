package com.Incamar.IncaCore.dtos.activity;

import lombok.Data;

@Data
public class ActivityResponseDto {
    private Long id;
    private Long maintenanceOrderId;
    private String maintenanceOrder;
    private String activityType;
    private Long vesselItemId;
    private String vesselItemName;
    private String description;
    private Long inventoryMovementId;
}
