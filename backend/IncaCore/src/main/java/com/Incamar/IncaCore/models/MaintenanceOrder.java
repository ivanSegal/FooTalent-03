package com.Incamar.IncaCore.models;

import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.enums.MaintenanceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "maintenance_order")
public class MaintenanceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Embarcacion (fk vessel_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_id", nullable = false)
    private Vessel vessel;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type", nullable = false)
    private MaintenanceType maintenanceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MaintenanceOrderStatus maintenanceOrderStatus = MaintenanceOrderStatus.SOLICITADO;

    // Usuario que crea la orden (fk maintenance_manager_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maintenance_manager_id", nullable = false)
    private User maintenanceManager;

    @Column(name = "issuedAt",
            updatable = false,
            insertable = false,
            nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime issuedAt = LocalDateTime.now();
    @Column(name = "scheduled_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime scheduledAt;
    @Column(name = "started_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime startedAt;
    @Column(name = "finished_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime finishedAt;

    @Column(name = "maintenance_reason")
    private String maintenanceReason;
}
