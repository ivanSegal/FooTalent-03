package com.Incamar.IncaCore.dtos.maintenanceOrder;

import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.enums.MaintenanceType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MaintenanceOrderResponseDto {
    private Long id;
    @JsonProperty("embarcacionNombre")
    private String vesselName;
    @JsonProperty("tipoMantenimiento")
    private MaintenanceType maintenanceType;
    @JsonProperty("estado")
    private MaintenanceOrderStatus maintenanceOrderStatus;
    @JsonProperty("encargadoMantenimientoUsername")
    private String maintenanceManagerUsername;
    @JsonProperty("motivoMantenimiento")
    private String maintenanceReason;
    @JsonProperty("fechaEmision")
    private LocalDateTime issuedAt;
    @JsonProperty("fechaProgramada")
    private LocalDateTime scheduledAt;
    @JsonProperty("fechaInicio")
    private LocalDateTime startedAt;
    @JsonProperty("fechaFin")
    private LocalDateTime finishedAt;
}
