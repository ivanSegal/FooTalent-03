package com.Incamar.IncaCore.dtos.activity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class ActivityRequestDto {
    @NotNull(groups = Create.class)
    @Schema(description = "Id de la orden de mantenimiento a la que se le asociará esta orden.", example = "2")
    private Long maintenanceOrderId;
    @Schema(description = "Id del componente o subcomponente de la embarcacion a la que se le asociará esta orden.", example = "2")
    @NotNull(groups = Create.class)
    private Long vesselItemId;
    @Pattern(
            regexp = "INSEPCCION|LIMPIEZA|LUBRICACION|AJUSTES|CALIBRACION|CAMBIO_PROGRAMADO|" +
                    "REEMPLAZO_FALLO|REPARACION",
            message = "El tipo de actividad debe ser uno de los siguientes: INSEPCCION, LIMPIEZA, LUBRICACION, " +
                    "AJUSTES, CALIBRACION, CAMBIO_PROGRAMADO, REEMPLAZO_FALLO, REPARACION"
    )
    @Schema(
            description = "Tipo de Actividad. Valores válidos: INSEPCCION, LIMPIEZA, LUBRICACION, AJUSTES, " +
                    "CALIBRACION, CAMBIO_PROGRAMADO, REEMPLAZO_FALLO, REPARACION",
            example = "INSEPCCION"
    )
    @NotNull(groups = Create.class)
    private String activityType;
    /*@Schema(description = "Id del movimiento del almacen a la que se le asociará esta orden.", example = "2")
    private Long inventoryMovementId;*/
    @Schema(description = "Ids de los movimientos del almacén asociados a esta actividad.", example = "[1,2,3]")
    private List<Long> inventoryMovementIds;
    private String description;

    public interface Create {}
    public interface Update {}
}
