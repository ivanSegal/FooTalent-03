package com.Incamar.IncaCore.models;


import com.Incamar.IncaCore.enums.MovementType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "inventory_movement_details")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovementDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_movement_id", nullable = false)
    private InventoryMovement inventoryMovement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_warehouse_id", nullable = false)
    private ItemWarehouse itemWarehouse;

    @Column(nullable = false)
    private Long quantity;

}
