package com.Incamar.IncaCore.dtos.boletaServicio;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;


@Data
public class BoletaServicioRequestDto {

    @NotNull(groups = {Create.class, Update.class})
    private Long boatId;

    @NotNull(groups = Create.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate travelDate;

    @NotNull(groups = Create.class)
    @Positive
    private Long travelNro;

    @Schema(description = "Nombre de la embarcación atendida", example = "Varada Blessing")
    @NotBlank(groups = Create.class)
    private String vesselAttended;

    @Schema(description = "Empresa que solicita el servicio", example = "Kronos")
    @NotBlank(groups = Create.class)
    private String solicitedBy;

    @NotBlank(groups = Create.class)
    @Pattern(
            regexp = "^[A-Z]{3,4}-\\d{2}-\\d{1,4}$",
            message = "El formato debe ser AAA-00-0 hasta AAAA-00-0000"
    )
    private String reportTravelNro;

    @NotBlank(groups = Create.class)
    private String code;

    @NotNull(groups = Create.class)
    @Positive
    private Long checkingNro;

    public interface Create {}
    public interface Update {}
}
