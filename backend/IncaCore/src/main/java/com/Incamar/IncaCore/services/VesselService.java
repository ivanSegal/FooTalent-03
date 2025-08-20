package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.vessels.VesselRequestDto;
import com.Incamar.IncaCore.dtos.vessels.VesselResponseDto;
import com.Incamar.IncaCore.exceptions.BadRequestException;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.VesselMapper;
import com.Incamar.IncaCore.models.Vessel;
import com.Incamar.IncaCore.repositories.VesselRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VesselService implements IVesselService {
    @Autowired
    VesselRepository vesselRepository;
    @Autowired
    private VesselMapper vesselMapper;

    @Override
    public Page<VesselResponseDto> getAllVessels(Pageable pageable) {
        Page<Vessel> vessels = vesselRepository.findAll(pageable);
        return vessels.map(vesselMapper::toResponseDTO);
    }

    @Override
    public VesselResponseDto getVesselById(Long id) {
        Vessel vessel = vesselRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Embarcación no encontrada con ID: " + id));
        return vesselMapper.toResponseDTO(vessel);
    }

    @Override
    public VesselResponseDto createVessel(VesselRequestDto vesselRequestDto) {
        if(vesselRepository.existsByName(vesselRequestDto.getName())) {
            throw new BadRequestException("El nombre de la embarcacion ya existe.");
        }
        Vessel vessel = vesselMapper.toEntity(vesselRequestDto);
        vesselRepository.save(vessel);
        return vesselMapper.toResponseDTO(vessel);
    }

    @Override
    public void deleteVesselById(Long id) {
        if(!vesselRepository.existsById(id)){
            throw new ResourceNotFoundException("No se encontró embarcación con ID: " + id);
        }
        vesselRepository.deleteById(id);
    }

    @Override
    public VesselResponseDto editEmbarcacion(Long id, VesselRequestDto vesselRequestDto) {
        Vessel auxVessel = vesselRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Embarcación no encontrada con ID: " + id));
        vesselMapper.updateEntityFromDto(vesselRequestDto, auxVessel);
        vesselRepository.save(auxVessel);
        return vesselMapper.toResponseDTO(auxVessel);
    }

    @Override
    public Page<VesselResponseDto> searchVesselByName(String nombre, Pageable pageable) {
        Page<Vessel> vessels = vesselRepository.findByNameContainingIgnoreCase(nombre,pageable);
        return vessels.map(vesselMapper::toResponseDTO);
    }
}
