package com.Incamar.IncaCore.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "embarcaciones")
public class Embarcacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "El nombre es obligatorio")
    private String name;
    @NotBlank(message = "El número de matrícula es obligatoria")
    private String vessel_registration_number;
    @NotBlank(message = "El modelo es obligatorio")
    private String model;
    @NotBlank(message = "El ISSM es obligatorio")
    private String issm;
    @NotBlank(message = "La bandera es obligatorio")
    private String flag;
    @NotBlank(message = "El distintivo es obligatorio")
    private String distinctive;
    @NotBlank(message = "El puerto registrado es obligatorio")
    private String registrationPort;
    @NotBlank(message = "El RIF es obligatorio")
    private String rif;
    @NotBlank(message = "El uso de la embarcación es obligatorio")
    private String use;
    @NotBlank(message = "El material de construcción es obligatorio")
    private String hullMaterial;
    @NotBlank(message = "La información de la popa es obligatoria")
    private String stern;
    @NotBlank(message = "La información del tipo de combustible es obligatoria")
    private String fuelType;

    private String engineHours;
}
