package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.vessels.VesselRequestDto;
import com.Incamar.IncaCore.dtos.vessels.VesselResponseDto;
import com.Incamar.IncaCore.models.Vessel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IVesselService {
    Page<Vessel> getAllVessels(Pageable pageable);
    VesselResponseDto getVesselById(Long id);
    VesselResponseDto createVessel(VesselRequestDto vesselRequestDto);
    void deleteVesselById(Long id);
    VesselResponseDto editEmbarcacion(Long id, VesselRequestDto vessel);
    Page<VesselResponseDto> searchVesselByName(String nombre, Pageable pageable);
}
