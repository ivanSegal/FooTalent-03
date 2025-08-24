package com.Incamar.IncaCore.dtos.maintenanceOrder;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MaintenanceOrderRequestDto {

    @NotNull(groups = Create.class)
    private Long vesselId;
    /*@Schema(description = "Nombre de la embarcación", example = "Varada Blessing")
    @NotBlank(groups = Create.class)
    private String vesselAttended;*/

    @Pattern(
            regexp = "PREVENTIVO|CORRECTIVO",
            message = "El tipo de mantenimiento debe ser uno de los siguientes: PREVENTIVO o CORRECTIVO"
    )
    @Schema(
            description = "Tipo de Mantenimiento. Valores válidos: PREVENTIVO o CORRECTIVO",
            example = "PREVENTIVO"
    )
    @NotNull(groups = Create.class)
    private String maintenanceType;

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
    private String status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Schema(example = "dd-MM-yyyy")
    private LocalDate issuedAt;
    //@Schema(hidden = true)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Schema(example = "dd-MM-yyyy")
    private LocalDate scheduledAt;
    //@Schema(hidden = true)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Schema(example = "dd-MM-yyyy")
    private LocalDate startedAt;
    //@Schema(hidden = true)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @Schema(example = "dd-MM-yyyy")
    private LocalDate finishedAt;

    private String maintenanceReason;

    public interface Create {}
    public interface Update {}
}
