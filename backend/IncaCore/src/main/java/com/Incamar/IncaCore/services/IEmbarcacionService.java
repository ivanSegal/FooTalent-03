package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.models.Embarcacion;

import java.util.List;

public interface IEmbarcacionService {
    List<Embarcacion> getAllEmbarcaciones();
    Embarcacion getEmbarcacionById(Long id);
    void createEmbarcacion(String nombre, String nPatente, String capitan, String modelo);
    void deleteEmbarcacionById(Long id);
    Embarcacion editEmbarcacion(Long id, Embarcacion embarcacion);
}
