package com.Incamar.IncaCore.dtos.stock;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StockUpdateDto {

    @Schema(description = "Cantidad mínima permitida antes de reposición", example = "20")
    @NotNull(message = "El stock minimo es obligatorio")
    private Long stockMin;
}
