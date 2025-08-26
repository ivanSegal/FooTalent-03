package com.Incamar.IncaCore.dtos.travel;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalTime;

@Data
public class TravelResponseDto {

    @Schema(example = "5")
    private Long id;

    @Schema(example = "Puerto de Pertigalete")
    private String origin;

    @Schema(example = "Puerto de Pozuelos")
    private String destination;

    @Schema(example = "08:30")
    private LocalTime departureTime;

    @Schema(example = "12:45")
    private LocalTime arrivalTime;

    @Schema(description = "ID del detalle de la boleta asociado", example = "12")
    private Long serviceTicketDetailId;
}

