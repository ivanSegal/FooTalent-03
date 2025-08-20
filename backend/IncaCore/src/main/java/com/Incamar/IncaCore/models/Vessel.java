package com.Incamar.IncaCore.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "vessels",uniqueConstraints = {@UniqueConstraint(columnNames = "name")})
public class Vessel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String registrationNumber;
    private String ismm;
    private String flagState;
    private String callSign;
    private String portOfRegistry;
    private String rif;
    private String serviceType;
    private String constructionMaterial;
    private String sternType;
    private String fuelType;
    private Double navigationHours;
}
