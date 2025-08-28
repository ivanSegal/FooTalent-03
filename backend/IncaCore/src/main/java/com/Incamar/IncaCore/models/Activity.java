package com.Incamar.IncaCore.models;

import com.Incamar.IncaCore.enums.ActivityType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Relación con Orden de Mantenimiento(fk maintenance_order_id)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vessel_id", nullable = false)
    private MaintenanceOrder maintenanceOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_item_id", nullable = false)
    private VesselItem vesselItem;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;

    @Column(name = "description")
    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_movement_id")
    private InventoryMovement inventoryMovement;

    public String getMaintenanceOrderSummary() {
        return maintenanceOrder.getId() + "-" +
                maintenanceOrder.getVessel().getName() + "-" +
                maintenanceOrder.getMaintenanceType();
    }

}
