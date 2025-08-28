package com.Incamar.IncaCore.dtos.vessels;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VesselResponseDto {
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
    private String status;
}
