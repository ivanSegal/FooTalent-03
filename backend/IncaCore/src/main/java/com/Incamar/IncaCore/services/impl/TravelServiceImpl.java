package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.travel.TravelRequestDto;
import com.Incamar.IncaCore.dtos.travel.TravelResponseDto;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.TravelMapper;
import com.Incamar.IncaCore.models.ServiceTicketDetail;
import com.Incamar.IncaCore.models.Travel;
import com.Incamar.IncaCore.repositories.ServiceTicketDetailRepository;
import com.Incamar.IncaCore.repositories.TravelRepository;
import com.Incamar.IncaCore.services.TravelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TravelServiceImpl implements TravelService {


    private final TravelRepository travelRepo;
    private final ServiceTicketDetailRepository detailRepo;
    private final TravelMapper mapper;

    @Override
    public TravelResponseDto create(TravelRequestDto dto) {
        ServiceTicketDetail detail = detailRepo.findById(dto.getServiceTicketDetailId())
                .orElseThrow(() -> new ResourceNotFoundException("Detalle no encontrado: " + dto.getServiceTicketDetailId()));
        Travel entity = mapper.toEntity(dto, detail);
        return mapper.toDto(travelRepo.save(entity));
    }

    @Override
    public List<TravelResponseDto> getByDetailId(Long detailId) {
        return travelRepo.findByServiceTicketDetail_Id(detailId).stream()
                .map(mapper::toDto) // El cálculo por viaje lo hace @AfterMapping en TravelMapper
                .toList();
    }

    @Override
    public TravelResponseDto update(Long id, TravelRequestDto dto) {
        Travel travel = travelRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Travel no encontrado con id: " + id));

        mapper.updateFromDto(dto, travel);
        Travel updated = travelRepo.save(travel);

        return mapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!travelRepo.existsById(id)) {
            throw new ResourceNotFoundException("Travel no encontrado con id: " + id);
        }
        travelRepo.deleteById(id);
    }

    @Override
    public String getTotalTraveledTime(Long detailId) {
        Duration total = travelRepo.findByServiceTicketDetail_Id(detailId).stream()
                .map(this::durationOf) // sigue usando este helper para sumar todos los viajes
                .reduce(Duration.ZERO, Duration::plus);
        return formatDuration(total);
    }

    private static String formatDuration(Duration d) {
        long hours = d.toHours();
        long minutes = d.minusHours(hours).toMinutes();
        return String.format("%02d:%02d", hours, minutes);
    }

    private Duration durationOf(Travel t) {
        if (t.getDepartureTime() == null || t.getArrivalTime() == null) {
            return Duration.ZERO;
        }
        Duration d = Duration.between(t.getDepartureTime(), t.getArrivalTime());
        return d.isNegative() ? Duration.ZERO : d;
    }
}
