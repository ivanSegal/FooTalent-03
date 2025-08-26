package com.Incamar.IncaCore.dtos.inventory;

import com.Incamar.IncaCore.enums.MovementType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InventoryMovementResponseDto {

    @Schema(description = "ID del movimiento", example = "10")
    private Long id;

    @Schema(description = "ID del ítem en el almacén", example = "1")
    private Long itemWarehouseId;

    @Schema(description = "Nombre del ítem en el almacén", example = "Tornillos de acero")
    private String itemWarehouseName;

    @Schema(description = "Tipo de movimiento (ENTRADA o SALIDA)", example = "ENTRADA")
    private MovementType movementType;

    private Integer quantity;

    @Schema(description = "Fecha del movimiento", example = "2025-08-26")
    private LocalDate date;

    @Schema(description = "Motivo del movimiento", example = "Reposición de stock")
    private String reason;

    @Schema(description = "ID del usuario responsable", example = "5")
    private Long responsibleId;

    @Schema(description = "Nombre del usuario responsable", example = "Claudia Ramos")
    private String responsibleName;
}
