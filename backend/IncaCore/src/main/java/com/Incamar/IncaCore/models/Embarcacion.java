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
    private String nombre;
    @NotBlank(message = "La patente es obligatoria")
    private String nPatente;
    @NotBlank(message = "El capitán es obligatorio")
    private String capitan;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;
}
