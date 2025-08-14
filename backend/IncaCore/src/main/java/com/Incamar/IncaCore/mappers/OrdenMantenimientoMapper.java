package com.Incamar.IncaCore.mappers;


import com.Incamar.IncaCore.dtos.ordenMantenimiento.OrdenMantenimientoRequestDto;
import com.Incamar.IncaCore.dtos.ordenMantenimiento.OrdenMantenimientoResponseDto;
import com.Incamar.IncaCore.enums.Estado;
import com.Incamar.IncaCore.enums.TipoMantenimiento;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.models.OrdenMantenimiento;
import com.Incamar.IncaCore.models.User;
import org.springframework.stereotype.Component;

@Component
public class OrdenMantenimientoMapper {

    public OrdenMantenimiento toEntity(OrdenMantenimientoRequestDto dto, Embarcacion embarcacion, User usuario) {
        OrdenMantenimiento orden = new OrdenMantenimiento();
        orden.setEmbarcacion(embarcacion);
        orden.setTipoMantenimiento(TipoMantenimiento.valueOf(dto.getTipoMantenimiento()));
        if (dto.getEstado() != null) {
            orden.setEstado(Estado.valueOf(dto.getEstado()));// Se pone Solicitado si no se envió el estado
        }
        orden.setUsuarioPeticion(usuario);
        orden.setDescripcion(dto.getDescripcion());
        orden.setFechaMantenimiento(dto.getFechaMantenimiento() != null ? dto.getFechaMantenimiento() : orden.getFechaMantenimiento());
        return orden;
    }

    public OrdenMantenimientoResponseDto toDTO(OrdenMantenimiento orden) {
        OrdenMantenimientoResponseDto dto = new OrdenMantenimientoResponseDto();
        dto.setId(orden.getId());
        dto.setEmbarcacionNombre(orden.getEmbarcacion().getNombre());
        dto.setTipoMantenimiento(orden.getTipoMantenimiento());
        dto.setEstado(orden.getEstado());
        dto.setUsuarioPeticionUsername(orden.getUsuarioPeticion().getUsername());
        dto.setDescripcion(orden.getDescripcion());
        dto.setFechaMantenimiento(orden.getFechaMantenimiento());
        return dto;
    }
}
