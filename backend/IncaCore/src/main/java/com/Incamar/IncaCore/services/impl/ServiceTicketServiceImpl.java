package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.ServiceTicketMapper;
import com.Incamar.IncaCore.models.ServiceTicket;
import com.Incamar.IncaCore.models.Vessel;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.ServiceTicketRepository;
import com.Incamar.IncaCore.repositories.VesselRepository;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.services.ServiceTicketService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ServiceTicketServiceImpl implements ServiceTicketService {


    private final ServiceTicketRepository serviceTicketRepository;
    private final UserRepository userRepository;
    private final VesselRepository vesselRepository;
    private final ServiceTicketMapper mapper;
    private final AuthServiceImpl authService;

    // Regex para AAA-00-0 .. AAAA-00-0000, capturando el último bloque numérico
    private static final Pattern REPORT_TRAVEL_PATTERN =
            Pattern.compile("^[A-Z]{3,4}-\\d{2}-(\\d{1,4})$");

    @Override
    public Page<ServiceTicketResponseDto> getAllBoletasServicio(Pageable pageable) {
        return serviceTicketRepository.findAll(pageable).map(mapper::toDTO);
    }

    @Override
    public ServiceTicketResponseDto getBoletaServicioById(Long id) {
        ServiceTicket entity = serviceTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta de servicio no encontrada. Id = " + id));
        return mapper.toDTO(entity);
    }

    @Override
    public ServiceTicketResponseDto createBoletaServicio(ServiceTicketRequestDto requestDto) {

        Vessel boat = vesselRepository.findById(requestDto.getBoatId())
                .orElseThrow(() -> new ResourceNotFoundException("Embarcación asociada a la boleta de servicio no encontrada."));

        User responsible = authService.getAuthenticatedUser().orElseThrow(()->new  ResourceNotFoundException("Usuario no encontraado"));

        validateTravelConsistency(requestDto.getTravelNro(), requestDto.getReportTravelNro());

        ServiceTicket entity = mapper.toEntity(requestDto, boat, responsible);
        return mapper.toDTO(serviceTicketRepository.save(entity));
    }

    @Override
    public ServiceTicketResponseDto editBoletaServicio(Long id, ServiceTicketRequestDto requestDto) {
        ServiceTicket entity = serviceTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta de servicio no encontrada."));

        if (requestDto.getBoatId() != null) {
            Vessel boat = vesselRepository.findById(requestDto.getBoatId())
                    .orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada."));
            entity.setBoat(boat);
        }

        Long effectiveTravelNro = requestDto.getTravelNro() != null ? requestDto.getTravelNro() : entity.getTravelNro();
        String effectiveReport = requestDto.getReportTravelNro() != null ? requestDto.getReportTravelNro() : entity.getReportTravelNro();
        validateTravelConsistency(effectiveTravelNro, effectiveReport);

        if (requestDto.getTravelDate() != null)      entity.setTravelDate(requestDto.getTravelDate());
        if (requestDto.getCheckingNro() != null)     entity.setCheckingNro(requestDto.getCheckingNro());
        if (requestDto.getVesselAttended() != null)  entity.setVesselAttended(requestDto.getVesselAttended());
        if (requestDto.getSolicitedBy() != null)     entity.setSolicitedBy(requestDto.getSolicitedBy());
        if (requestDto.getTravelNro() != null)       entity.setTravelNro(requestDto.getTravelNro());
        if (requestDto.getReportTravelNro() != null) entity.setReportTravelNro(requestDto.getReportTravelNro());
        if (requestDto.getCode() != null)            entity.setCode(requestDto.getCode());

        return mapper.toDTO(serviceTicketRepository.save(entity));
    }

    @Override
    public void deleteBoletaServicioById(Long id) {
        if (!serviceTicketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Boleta de servicio no encontrada. Id = " + id);
        }
        serviceTicketRepository.deleteById(id);
    }

    @Override
    public Page<ServiceTicketResponseDto> searchBoletaServicioByBoat(String boatName, Pageable pageable) {
        return serviceTicketRepository.findByBoat_NameContainingIgnoreCase(boatName, pageable)
                .map(mapper::toDTO);
    }

    /** Regla de negocio: travelNro debe coincidir con los últimos dígitos de reportTravelNro. */
    private void validateTravelConsistency(Long travelNro, String reportTravelNro) {
        if (travelNro == null || reportTravelNro == null) {
            return;
        }
        Matcher m = REPORT_TRAVEL_PATTERN.matcher(reportTravelNro);
        if (!m.matches()) {
            throw new ValidationException("reportTravelNro no cumple el formato AAA-00-0/AAAA-00-0000");
        }
        long lastBlock = Long.parseLong(m.group(1)); // "0123" -> 123
        if (lastBlock != travelNro) {
            throw new ValidationException("travelNro debe coincidir con los últimos dígitos de reportTravelNro");
        }
    }

}
