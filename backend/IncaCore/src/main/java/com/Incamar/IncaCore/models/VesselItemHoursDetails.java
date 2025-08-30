package com.Incamar.IncaCore.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "vessel_item_hours_details")
@Data
@NoArgsConstructor
public class VesselItemHoursDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_item_id", nullable = false)
    private VesselItem vesselItem;

    @Column(precision = 10, scale = 2)
    private BigDecimal assignedHours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private VesselItemHours vesselItemHours;
}