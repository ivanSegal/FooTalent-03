package com.Incamar.IncaCore.dtos.inventory;

import com.Incamar.IncaCore.enums.MovementType;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InventoryMovementRequestDto {

    @Schema(description = "ID del almacén", example = "10")
    @NotNull(message = "El ID del almacén es obligatorio")
    private Long warehouseId;

    @Schema(description = "Tipo de movimiento (ENTRADA o SALIDA)", example = "ENTRADA")
    @NotNull(message = "El tipo de movimiento es obligatorio")
    private MovementType movementType;

    @Schema(description = "Fecha del movimiento", example = "2025-08-24")
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate date;

    @Schema(description = "Razón del movimiento", example = "Ingreso por compra de proveedor")
    @NotBlank(message = "La razón es obligatoria")
    private String reason;

    @ArraySchema(
            arraySchema = @Schema(
                    description = "Lista de detalles de los stocks afectados por el movimiento",
                    example = "[{\"itemWarehouseId\":10,\"itemWarehouseName\":\"Item A\",\"quantity\":50}]"
            )
    )
    @NotEmpty(message = "La lista de detalles no puede estar vacía")
    @Valid
    private List<MovementDetailsRequestDto> movementDetails;
}
