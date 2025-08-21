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
@Table(name = "boletaServicio")
public class ServiceTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // obligatorios (reglas simples de dominio)
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

    // El patrón se valida en el DTO (entrada)
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
    private Vessel boat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "responsible_id", nullable = false)
    private User responsible;
}
