package com.Incamar.IncaCore.dtos.inventory;

import com.Incamar.IncaCore.enums.MovementType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InventoryMovementRequestDto {

    @Schema(description = "ID del ítem en el almacén", example = "10")
    @NotNull(message = "El ID del ítem en el almacén es obligatorio")
    private Long itemWarehouseId;

    @Schema(description = "Tipo de movimiento (ENTRADA o SALIDA)", example = "ENTRADA")
    @NotNull(message = "El tipo de movimiento es obligatorio")
    private MovementType movementType;

    @Schema(description = "Cantidad de ítems a mover", example = "50")
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer quantity;

    @Schema(description = "Fecha del movimiento", example = "2025-08-24")
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate date;

    @Schema(description = "Razón del movimiento", example = "Ingreso por compra de proveedor")
    @NotBlank(message = "La razón es obligatoria")
    private String reason;

    @Schema(description = "ID del usuario responsable", example = "5")
    @NotNull(message = "El ID del usuario responsable es obligatorio")
    private Long responsibleId;
}
