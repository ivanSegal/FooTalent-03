package com.Incamar.IncaCore.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(nullable = false)
    private Integer assignedHours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private VesselItemHours vesselItemHours;
}