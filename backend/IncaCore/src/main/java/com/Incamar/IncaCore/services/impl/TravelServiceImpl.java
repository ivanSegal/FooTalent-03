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
        return travelRepo.findByServiceTicketDetail_Id(detailId)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public int getTotalTraveledHours(Long detailId) {
        List<Travel> travels = travelRepo.findByServiceTicketDetail_Id(detailId);

        return travels.stream()
                .mapToInt(t -> (int) Duration.between(t.getDepartureTime(), t.getArrivalTime()).toHours())
                .sum();
    }
}
