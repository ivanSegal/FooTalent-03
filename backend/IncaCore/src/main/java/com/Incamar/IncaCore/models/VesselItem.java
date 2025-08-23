package com.Incamar.IncaCore.models;

import com.Incamar.IncaCore.enums.ControlType;
import com.Incamar.IncaCore.enums.MaterialType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vessel_items")
@Data
@RequiredArgsConstructor
public class VesselItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column( precision = 10, scale = 2)
    private BigDecimal accumulatedHours;
    private Integer usefulLifeHours;
    private Integer alertHours;

    @Enumerated(EnumType.STRING)
    private ControlType controlType;

    @Enumerated(EnumType.STRING)
    private MaterialType materialType;

    // Relación autoreferenciada (componente ↔ subcomponente)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_item_id")
    private VesselItem component;

    @OneToMany(mappedBy = "component", cascade = CascadeType.ALL)
    private List<VesselItem> subcomponents = new ArrayList<>();
    //.........................................................

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vessel_id", nullable = false)
    private Vessel vessel;




}
