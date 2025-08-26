package com.Incamar.IncaCore.dtos.travel;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class TravelRequestDto {

    @Schema(description = "ID del ServiceTicketDetail asociado", example = "12")
    @NotNull
    private Long serviceTicketDetailId;

    @Schema(example = "Puerto de Pertigalete")
    @NotBlank
    private String origin;

    @Schema(example = "Puerto de José")
    @NotBlank
    private String destination;

    @Schema(example = "08:30")
    @NotNull
    private LocalTime departureTime;

    @Schema(example = "12:45")
    @NotNull
    private LocalTime arrivalTime;
}

