package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.ordenMantenimiento.OrdenMantenimientoRequestDto;
import com.Incamar.IncaCore.dtos.ordenMantenimiento.OrdenMantenimientoResponseDto;
import com.Incamar.IncaCore.dtos.user.JwtDataDto;
import com.Incamar.IncaCore.enums.Estado;
import com.Incamar.IncaCore.enums.TipoMantenimiento;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.OrdenMantenimientoMapper;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.models.OrdenMantenimiento;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.EmbarcacionRepository;
import com.Incamar.IncaCore.repositories.OrdenMantenimientoRepository;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.services.OrdenMantenimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrdenMantenimientoServiceImpl implements OrdenMantenimientoService {
    private final OrdenMantenimientoRepository ordenMantenimientoRepository;
    private final EmbarcacionRepository embarcacionRepository;
    private final UserRepository userRepository;
    private final OrdenMantenimientoMapper mapper;

    @Override
    public Page<OrdenMantenimientoResponseDto> getAllOrdenesMantenimiento(Pageable pageable) {
        return ordenMantenimientoRepository.findAll(pageable)
                .map(mapper::toDTO);
    }

    @Override
    public OrdenMantenimientoResponseDto getOrdenMantenimientoById(Long id) {
        OrdenMantenimiento orden = ordenMantenimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de mantenimiento no encontrada con ID: " + id));
        return mapper.toDTO(orden);
    }

    @Override
    public OrdenMantenimientoResponseDto createOrdenMantenimiento(OrdenMantenimientoRequestDto dto, JwtDataDto jwtDataDto) {
        Embarcacion embarcacion = embarcacionRepository.findById(dto.getEmbarcacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada con ID: " + dto.getEmbarcacionId()));

        User usuarioLogueado = userRepository.findById(jwtDataDto.id())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        OrdenMantenimiento orden = mapper.toEntity(dto, embarcacion, usuarioLogueado);

        return mapper.toDTO(ordenMantenimientoRepository.save(orden));
    }

    @Override
    public void deleteOrdenMantenimientoById(Long id) {
        if (!ordenMantenimientoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Orden de mantenimiento no encontrada con ID: " + id);
        }
        ordenMantenimientoRepository.deleteById(id);
    }

    @Override
    public OrdenMantenimientoResponseDto editOrdenMantenimiento(Long id, OrdenMantenimientoRequestDto dto) {
        OrdenMantenimiento auxOrdenMantenimiento = ordenMantenimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de mantenimiento no encontrada con ID: " + id));

        Embarcacion embarcacion = embarcacionRepository.findById(dto.getEmbarcacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada con ID: " + dto.getEmbarcacionId()));

        // Actualizo campos
        auxOrdenMantenimiento.setEmbarcacion(embarcacion);
        if (dto.getEstado() != null) auxOrdenMantenimiento.setEstado(Estado.valueOf(dto.getEstado()));
        if (dto.getTipoMantenimiento() != null) auxOrdenMantenimiento.setTipoMantenimiento(TipoMantenimiento.valueOf(dto.getTipoMantenimiento()));
        if (dto.getDescripcion() != null) auxOrdenMantenimiento.setDescripcion(dto.getDescripcion());
        if (dto.getFechaMantenimiento() != null) auxOrdenMantenimiento.setFechaMantenimiento(dto.getFechaMantenimiento());

        return mapper.toDTO(ordenMantenimientoRepository.save(auxOrdenMantenimiento));
    }

    @Override
    public Page<OrdenMantenimientoResponseDto> searchOrdenMantenimientoPorEmbarcacion(String nombre, Pageable pageable) {
        return ordenMantenimientoRepository.findByEmbarcacion_NombreContainingIgnoreCase(nombre, pageable).map(mapper::toDTO);
    }
}
