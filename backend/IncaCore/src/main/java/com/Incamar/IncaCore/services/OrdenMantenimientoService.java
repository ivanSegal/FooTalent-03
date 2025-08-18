package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.ordenMantenimiento.OrdenMantenimientoRequestDto;
import com.Incamar.IncaCore.dtos.ordenMantenimiento.OrdenMantenimientoResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrdenMantenimientoService {
    Page<OrdenMantenimientoResponseDto> getAllOrdenesMantenimiento(Pageable pageable);

    OrdenMantenimientoResponseDto getOrdenMantenimientoById(Long id);

    OrdenMantenimientoResponseDto createOrdenMantenimiento(OrdenMantenimientoRequestDto dto, JwtDataDto jwtDataDto);

    void deleteOrdenMantenimientoById(Long id);

    OrdenMantenimientoResponseDto editOrdenMantenimiento(Long id, OrdenMantenimientoRequestDto dto);

    Page<OrdenMantenimientoResponseDto> searchOrdenMantenimientoPorEmbarcacion(String nombre, Pageable pageable);
}
