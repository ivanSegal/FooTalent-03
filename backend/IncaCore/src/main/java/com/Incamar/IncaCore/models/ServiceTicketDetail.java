package com.Incamar.IncaCore.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "service_ticket_details")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ServiceTicketDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con BoletaServicio (ServiceTicket)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_ticket_id", nullable = false)
    private ServiceTicket serviceTicket;

    @Column(name = "service_area", nullable = false)
    private String serviceArea;

    @Column(name = "service_type", nullable = false)
    private String serviceType;

    @Column(name = "description")
    private String description;

    @Column(name = "patron_fullname")
    private String patronFullName;

    @Column(name = "mariner_fullname")
    private String marinerFullName;

    @Column(name = "captain_fullname")
    private String captainFullName;
}
