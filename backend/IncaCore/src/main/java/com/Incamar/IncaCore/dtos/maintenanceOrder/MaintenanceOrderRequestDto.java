package com.Incamar.IncaCore.dtos.maintenanceOrder;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MaintenanceOrderRequestDto {

    @NotNull(groups = Create.class)
    //@JsonProperty("embarcacionId")
    private Long embarcacionId;

    @Pattern(
            regexp = "PREVENTIVO|CORRECTIVO",
            message = "El tipo de mantenimiento debe ser uno de los siguientes: PREVENTIVO o CORRECTIVO"
    )
    @Schema(
            description = "Tipo de Mantenimiento. Valores válidos: PREVENTIVO o CORRECTIVO",
            example = "PREVENTIVO"
    )
    @NotNull(groups = Create.class)
    private String tipoMantenimiento;

    @Pattern(
            regexp = "FINALIZADO|EN_PROCESO|ANULADO|ESPERANDO_INSUMOS|SOLICITADO|RECHAZADO",
            message = "El estado debe ser uno de los siguientes: FINALIZADO, " +
                    "EN_PROCESO, ANULADO, ESPERANDO_INSUMOS, SOLICITADO o RECHAZADO"
    )
    @Schema(
            description = "Estado. Valores válidos: FINALIZADO, EN_PROCESO, ANULADO, " +
                    "ESPERANDO_INSUMOS, SOLICITADO o RECHAZADO",
            example = "SOLICITADO"
    )
    private String estado;


    private LocalDateTime fechaEmision;
    //@Schema(hidden = true)
    private LocalDateTime fechaProgramada;
    //@Schema(hidden = true)
    private LocalDateTime fechaInicio;
    //@Schema(hidden = true)
    private LocalDateTime fechaFin;

    private String motivoMantenimiento;

    public interface Create {}
    public interface Edit {}
}
