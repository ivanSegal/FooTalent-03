package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.boletaServicio.BoletaServicioRequestDto;
import com.Incamar.IncaCore.dtos.boletaServicio.BoletaServicioResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.BoletaServicioMapper;
import com.Incamar.IncaCore.models.BoletaServicio;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.BoletaServicioRepository;
import com.Incamar.IncaCore.repositories.EmbarcacionRepository;
import com.Incamar.IncaCore.repositories.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BoletaServicioService implements IBoletaServicioService {

    @Autowired BoletaServicioRepository boletaServicioRepository;
    @Autowired UserRepository userRepository;
    @Autowired EmbarcacionRepository embarcacionRepository;
    @Autowired BoletaServicioMapper mapper;

    // Regex para AAA-00-0 .. AAAA-00-0000, capturando el último bloque numérico
    private static final Pattern REPORT_TRAVEL_PATTERN =
            Pattern.compile("^[A-Z]{3,4}-\\d{2}-(\\d{1,4})$");

    @Override
    public Page<BoletaServicioResponseDto> getAllBoletasServicio(Pageable pageable) {
        return boletaServicioRepository.findAll(pageable).map(mapper::toDTO);
    }

    @Override
    public BoletaServicioResponseDto getBoletaServicioById(Long id) {
        BoletaServicio entity = boletaServicioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta de servicio no encontrada. Id = " + id));
        return mapper.toDTO(entity);
    }

    @Override
    public BoletaServicioResponseDto createBoletaServicio(BoletaServicioRequestDto requestDto, JwtDataDto jwtDataDto) {

        Embarcacion boat = embarcacionRepository.findById(requestDto.getBoatId())
                .orElseThrow(() -> new ResourceNotFoundException("Embarcación asociada a la boleta de servicio no encontrada."));
        User responsible = userRepository.findById(jwtDataDto.getUuid())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario asociado a la boleta de servicio no encontrado."));


        validateTravelConsistency(requestDto.getTravelNro(), requestDto.getReportTravelNro());

        BoletaServicio entity = mapper.toEntity(requestDto, boat, responsible);
        return mapper.toDTO(boletaServicioRepository.save(entity));
    }

    @Override
    public BoletaServicioResponseDto editBoletaServicio(Long id, BoletaServicioRequestDto requestDto) {
        BoletaServicio entity = boletaServicioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta de servicio no encontrada."));

        if (requestDto.getBoatId() != null) {
            Embarcacion boat = embarcacionRepository.findById(requestDto.getBoatId())
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

        return mapper.toDTO(boletaServicioRepository.save(entity));
    }

    @Override
    public void deleteBoletaServicioById(Long id) {
        if (!boletaServicioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Boleta de servicio no encontrada. Id = " + id);
        }
        boletaServicioRepository.deleteById(id);
    }

    @Override
    public Page<BoletaServicioResponseDto> searchBoletaServicioByBoat(String boatName, Pageable pageable) {
        return boletaServicioRepository.findByBoat_NameContainingIgnoreCase(boatName, pageable)
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
