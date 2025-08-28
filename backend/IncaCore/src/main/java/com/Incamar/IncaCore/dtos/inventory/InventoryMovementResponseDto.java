package com.Incamar.IncaCore.dtos.inventory;

import com.Incamar.IncaCore.enums.MovementType;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InventoryMovementResponseDto {

    @Schema(description = "ID del movimiento", example = "10")
    private Long id;

    @Schema(description = "ID del almacén", example = "10")
    private Long warehouseId;

    @Schema(description = "Nombre del almacén", example = "Deposito Central")
    private String warehouseName;

    @Schema(description = "Tipo de movimiento (ENTRADA o SALIDA)", example = "ENTRADA")
    private MovementType movementType;

    @Schema(description = "Fecha del movimiento", example = "2025-08-26")
    private LocalDate date;

    @Schema(description = "Motivo del movimiento", example = "Reposición de stock")
    private String reason;

    @Schema(description = "ID del usuario responsable", example = "5")
    private UUID responsibleId;

    @Schema(description = "Nombre del usuario responsable", example = "Claudia Ramos")
    private String responsibleName;


    private List<MovementDetailsResponseDto> movementDetails;
}
