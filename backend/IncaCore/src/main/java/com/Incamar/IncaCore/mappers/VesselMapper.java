package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.vessels.VesselRequestDto;
import com.Incamar.IncaCore.dtos.vessels.VesselResponseDto;
import com.Incamar.IncaCore.enums.VesselStatus;
import com.Incamar.IncaCore.models.Vessel;
import org.springframework.stereotype.Component;

@Component
public class VesselMapper {

    public Vessel toEntity(VesselRequestDto dto) {
        Vessel vessel = new Vessel();
        vessel.setName(dto.getName());
        vessel.setRegistrationNumber(dto.getRegistrationNumber());
        vessel.setIsmm(dto.getIsmm());
        vessel.setFlagState(dto.getFlagState());
        vessel.setCallSign(dto.getCallSign());
        vessel.setPortOfRegistry(dto.getPortOfRegistry());
        vessel.setRif(dto.getRif());
        vessel.setServiceType(dto.getServiceType());
        vessel.setConstructionMaterial(dto.getConstructionMaterial());
        vessel.setSternType(dto.getSternType());
        vessel.setFuelType(dto.getFuelType());
        vessel.setNavigationHours(dto.getNavigationHours());
        vessel.setStatus(VesselStatus.OPERATIONAL);
        return vessel;
    }

    public VesselResponseDto toResponseDTO(Vessel vessel) {
        VesselResponseDto dto = new VesselResponseDto();
        dto.setId(vessel.getId());
        dto.setName(vessel.getName());
        dto.setRegistrationNumber(vessel.getRegistrationNumber());
        dto.setIsmm(vessel.getIsmm());
        dto.setFlagState(vessel.getFlagState());
        dto.setCallSign(vessel.getCallSign());
        dto.setPortOfRegistry(vessel.getPortOfRegistry());
        dto.setRif(vessel.getRif());
        dto.setServiceType(vessel.getServiceType());
        dto.setConstructionMaterial(vessel.getConstructionMaterial());
        dto.setSternType(vessel.getSternType());
        dto.setFuelType(vessel.getFuelType());
        dto.setNavigationHours(vessel.getNavigationHours());
        dto.setStatus(vessel.getStatus().name());
        return dto;
    }

    public void updateEntityFromDto(VesselRequestDto dto, Vessel vessel) {
        vessel.setName(dto.getName());
        vessel.setRegistrationNumber(dto.getRegistrationNumber());
        vessel.setIsmm(dto.getIsmm());
        vessel.setFlagState(dto.getFlagState());
        vessel.setCallSign(dto.getCallSign());
        vessel.setPortOfRegistry(dto.getPortOfRegistry());
        vessel.setRif(dto.getRif());
        vessel.setServiceType(dto.getServiceType());
        vessel.setConstructionMaterial(dto.getConstructionMaterial());
        vessel.setSternType(dto.getSternType());
        vessel.setFuelType(dto.getFuelType());
        vessel.setNavigationHours(dto.getNavigationHours());
    }
}
