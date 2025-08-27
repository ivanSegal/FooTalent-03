package com.Incamar.IncaCore.dtos.serviceTicket;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;


@Data
public class ServiceTicketRequestDto {

    @NotNull(groups = {Create.class, Update.class})
    @Schema(description = "Id de la embarcación a la que se le asociará esta orden de servicio.", example = "2")
    private Long vesselId;

    @NotNull(groups = Create.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Schema(description = "Fecha en la que se efectuó el viaje.", example = "23-08-2025")
    private LocalDate travelDate;

    @NotNull(groups = Create.class)
    @Positive
    @Schema(description = "Número de viaje", example = "432")
    private Long travelNro;

    @Schema(description = "Nombre de la embarcación atendida.", example = "Varada Blessing")
    @NotBlank(groups = Create.class)
    private String vesselAttended;

    @Schema(description = "Empresa que solicita el servicio.", example = "Kronos")
    @NotBlank(groups = Create.class)
    private String solicitedBy;

    @NotBlank(groups = Create.class)
    @Pattern(
            regexp = "^[A-Z]{3,4}-\\d{2}-\\d{1,4}$",
            message = "El formato debe ser AAA-00-0 hasta AAAA-00-0000"
    )
    @Schema(description = "Código formado por el nombre de la embarcación, el año y el número de viaje.", example = "RNE-29-432")
    private String reportTravelNro;

    @NotBlank(groups = Create.class)
    private String code;

    @NotNull(groups = Create.class)
    @Positive
    private Long checkingNro;

    public interface Create {}
    public interface Update {}
}
