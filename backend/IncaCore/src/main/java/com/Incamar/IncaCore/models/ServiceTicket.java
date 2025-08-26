package com.Incamar.IncaCore.models;

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
@Table(name = "service_ticket")
public class ServiceTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long travelNro;

    @NotNull
    @Column(nullable = false)
    private LocalDate travelDate;

    @NotNull
    @Column(nullable = false, length = 120)
    private String vesselAttended;

    @NotNull
    @Column(nullable = false, length = 120)
    private String solicitedBy;

    @Column(nullable = false, length = 32)
    private String reportTravelNro;

    @NotNull
    @Column(nullable = false, length = 40)
    private String code;

    @NotNull
    @Column(nullable = false)
    private Long checkingNro;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vessel_id", nullable = false)
    private Vessel vessel;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "responsible_id", nullable = false)
    private User responsible;

    // ---------- 1 : 1 con detalles ----------
    @OneToOne(mappedBy = "serviceTicket",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private ServiceTicketDetail detail;

    /**
     * Helper para mantener ambos lados sincronizados
     */
    public void setDetail(ServiceTicketDetail detail) {
        this.detail = detail;
        if (detail != null) {
            detail.setServiceTicket(this);
        }

    }
}