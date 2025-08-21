package com.Incamar.IncaCore.services.vessel;

import com.Incamar.IncaCore.dtos.vessels.VesselRequestDto;
import com.Incamar.IncaCore.dtos.vessels.VesselResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VesselService {
    Page<VesselResponseDto> getAllVessels(Pageable pageable);
    VesselResponseDto getVesselById(Long id);
    VesselResponseDto createVessel(VesselRequestDto vesselRequestDto);
    void deleteVesselById(Long id);
    VesselResponseDto editEmbarcacion(Long id, VesselRequestDto vessel);
    Page<VesselResponseDto> searchVesselByName(String nombre, Pageable pageable);
}
