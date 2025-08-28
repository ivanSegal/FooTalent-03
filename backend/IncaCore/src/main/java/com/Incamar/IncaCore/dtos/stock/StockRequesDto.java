package com.Incamar.IncaCore.dtos.stock;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StockRequesDto {

    @Schema(description = "Cantidad actual en stock", example = "150")
    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Long stock;

    @Schema(description = "Cantidad mínima permitida antes de reposición", example = "20")
    @NotNull(message = "El stock mínimo es obligatorio")
    @Min(value = 0, message = "El stock mínimo no puede ser negativo")
    private Long stockMin;

    @Schema(description = "ID del almacén al que pertenece el stock de un item almacén determinado", example = "1")
    @NotNull(message = "El ID del almacén es obligatorio")
    private Long warehouseId;

    @Schema(description = "ID del item almacén ", example = "1")
    @NotNull(message = "El ID del item almacén es obligatorio")
    private Long itemWarehouseId;
}
