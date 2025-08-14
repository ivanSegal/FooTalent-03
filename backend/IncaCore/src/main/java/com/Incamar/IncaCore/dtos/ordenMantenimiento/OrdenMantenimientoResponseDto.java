package com.Incamar.IncaCore.dtos.ordenMantenimiento;

import com.Incamar.IncaCore.enums.Estado;
import com.Incamar.IncaCore.enums.TipoMantenimiento;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrdenMantenimientoResponseDto {
    private Long id;
    private String embarcacionNombre;
    private TipoMantenimiento tipoMantenimiento;
    private Estado estado;
    private String usuarioPeticionUsername;
    private String descripcion;
    private LocalDateTime fechaMantenimiento;
}
