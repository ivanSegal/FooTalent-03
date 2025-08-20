package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.repositories.EmbarcacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmbarcacionService implements  IEmbarcacionService{
    @Autowired
    EmbarcacionRepository embarcacionRepository;

    @Override
    public Page<Embarcacion> getAllEmbarcaciones(Pageable pageable) {
        return embarcacionRepository.findAll(pageable);
    }

    @Override
    public Embarcacion getEmbarcacionById(Long id) {
        return embarcacionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada con ID: " + id));
    }

    @Override
    public void createEmbarcacion(String nombre, String nPatente, String capitan, String modelo) {
        Embarcacion newEmbarcacion = new Embarcacion();

        newEmbarcacion.setName(nombre);
        newEmbarcacion.setNPatente(nPatente);
        newEmbarcacion.setCapitan(capitan);
        newEmbarcacion.setModelo(modelo);
        embarcacionRepository.save(newEmbarcacion);
    }

    @Override
    public void deleteEmbarcacionById(Long id) {
        if(!embarcacionRepository.existsById(id)){
            throw new ResourceNotFoundException("No se encontró embarcación con ID: " + id);
        }
        embarcacionRepository.deleteById(id);
    }

    @Override
    public Embarcacion editEmbarcacion(Long id, Embarcacion embarcacion) {
        //Optional<Embarcacion> optionalEmbarcacion = embarcacionRepository.findById(id);
        Embarcacion auxEmbarcacion = embarcacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada con ID: " + id));

        auxEmbarcacion.setName(embarcacion.getName());
        auxEmbarcacion.setNPatente(embarcacion.getNPatente());
        auxEmbarcacion.setCapitan(embarcacion.getCapitan());
        auxEmbarcacion.setModelo(embarcacion.getModelo());

        return embarcacionRepository.save(auxEmbarcacion);
    }

    @Override
    public Page<Embarcacion> searchEmbarcacionesByName(String nombre, Pageable pageable) {
        return embarcacionRepository.findByNameContainingIgnoreCase(nombre,pageable);
    }
}
