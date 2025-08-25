package com.Incamar.IncaCore.models;

import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.enums.MaintenanceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

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
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vessel_id", nullable = false)
    private Vessel vessel;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "maintenance_type", nullable = false)
    private MaintenanceType maintenanceType;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "status", nullable = false)
    private MaintenanceOrderStatus status = MaintenanceOrderStatus.SOLICITADO;

    // Usuario que crea la orden (fk maintenance_manager_id)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "maintenance_manager_id", nullable = false)
    private User maintenanceManager;

    /*@Column(name = "issuedAt",
            updatable = false,
            insertable = false,
            nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime issuedAt = LocalDateTime.now();*/

    @Column(name = "issuedAt", nullable = false, updatable = false)
    private LocalDate issuedAt;
    /*@Column(name = "scheduled_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime scheduledAt;
    @Column(name = "started_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime startedAt;
    @Column(name = "finished_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime finishedAt;*/
    @Column(name = "scheduled_at")
    private LocalDate scheduledAt;
    @Column(name = "started_at")
    private LocalDate startedAt;
    @Column(name = "finished_at")
    private LocalDate finishedAt;

    @Column(name = "maintenance_reason")
    private String maintenanceReason;

    @PrePersist
    protected void onCreate() {
        issuedAt = LocalDate.now();
    }
}
