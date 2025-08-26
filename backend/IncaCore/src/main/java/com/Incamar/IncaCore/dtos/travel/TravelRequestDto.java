package com.Incamar.IncaCore.dtos.travel;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "HH:mm")
    @NotNull
    private LocalTime departureTime;

    @Schema(example = "12:45")
    @JsonFormat(pattern = "HH:mm")
    @NotNull
    private LocalTime arrivalTime;
}

