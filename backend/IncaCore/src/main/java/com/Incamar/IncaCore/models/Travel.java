package com.Incamar.IncaCore.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "travels")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Travel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String origin;

    @Column(nullable = false, length = 100)
    private String destination;

    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalTime arrivalTime;

    // Relación con ServiceTicketDetail (1 -> muchos travels)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_ticket_detail_id", nullable = false)
    private ServiceTicketDetail serviceTicketDetail;
}
