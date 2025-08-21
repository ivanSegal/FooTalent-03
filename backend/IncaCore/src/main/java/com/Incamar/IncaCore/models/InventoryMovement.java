package com.Incamar.IncaCore.models;

import com.Incamar.IncaCore.enums.MovementType;
import jakarta.persistence.*;

import java.time.LocalDate;

public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_warehouse_id", nullable = false)
    private ItemWarehouse itemWarehouse;


    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false)
    private MovementType movementType;


    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User responsible;
}
