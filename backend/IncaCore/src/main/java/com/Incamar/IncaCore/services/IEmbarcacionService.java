package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.users.UserResponseDto;
import com.Incamar.IncaCore.models.Embarcacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEmbarcacionService {
    Page<Embarcacion> getAllEmbarcaciones(Pageable pageable);
    Embarcacion getEmbarcacionById(Long id);
    void createEmbarcacion(String nombre, String nPatente, String capitan, String modelo);
    void deleteEmbarcacionById(Long id);
    Embarcacion editEmbarcacion(Long id, Embarcacion embarcacion);
    Page<Embarcacion> searchEmbarcacionesByName(String nombre, Pageable pageable);
}
