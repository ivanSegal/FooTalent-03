package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailResponseDto;
import com.Incamar.IncaCore.exceptions.MethodArgumentNotValidException;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.ServiceTicketDetailMapper;
import com.Incamar.IncaCore.models.ServiceTicket;
import com.Incamar.IncaCore.models.ServiceTicketDetail;
import com.Incamar.IncaCore.repositories.ServiceTicketDetailRepository;
import com.Incamar.IncaCore.repositories.ServiceTicketRepository;
import com.Incamar.IncaCore.services.ServiceTicketDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServiceTicketDetailServiceImpl implements ServiceTicketDetailService{

    private final ServiceTicketDetailRepository detailRepo;
    private final ServiceTicketRepository ticketRepo;
    private final ServiceTicketDetailMapper mapper;

    @Override
    public ServiceTicketDetailResponseDto create(ServiceTicketDetailRequestDto dto) {
        // Cargar ticket padre
        ServiceTicket parent = ticketRepo.findById(dto.getServiceTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("ServiceTicket no encontrado: " + dto.getServiceTicketId()));

        // En 1–1 evitamos duplicados
        if (detailRepo.existsByServiceTicket_Id(parent.getId())) {
            throw new MethodArgumentNotValidException("El ServiceTicket ya tiene un detalle asociado.");
        }

        ServiceTicketDetail entity = mapper.toEntity(dto, parent);
        return mapper.toDto(detailRepo.save(entity));
    }

    @Override
    public ServiceTicketDetailResponseDto getById(Long id) {
        ServiceTicketDetail entity = detailRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceTicketDetail no encontrado: " + id));
        return mapper.toDto(entity);
    }

    @Override
    public ServiceTicketDetailResponseDto update(Long id, ServiceTicketDetailRequestDto dto) {
        ServiceTicketDetail entity = detailRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceTicketDetail no encontrado: " + id));

        // (Opcional) permitir mover el detalle a otro ticket:
        if (dto.getServiceTicketId() != null && !dto.getServiceTicketId().equals(entity.getServiceTicket().getId())) {
            ServiceTicket newParent = ticketRepo.findById(dto.getServiceTicketId())
                    .orElseThrow(() -> new ResourceNotFoundException("ServiceTicket no encontrado: " + dto.getServiceTicketId()));

            if (detailRepo.existsByServiceTicket_Id(newParent.getId())) {
                throw new MethodArgumentNotValidException("El nuevo ServiceTicket ya tiene un detalle asociado.");
            }
            entity.setServiceTicket(newParent);
        }

        mapper.updateDetailsFromDto(dto, entity);
        return mapper.toDto(detailRepo.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!detailRepo.existsById(id)) {
            throw new ResourceNotFoundException("ServiceTicketDetail no encontrado: " + id);
        }
        detailRepo.deleteById(id);
    }

    @Override
    public Page<ServiceTicketDetailResponseDto> getAll(Pageable pageable) {
        return detailRepo.findAll(pageable).map(mapper::toDto);
    }

    @Override
    public ServiceTicketDetailResponseDto getByServiceTicketId(Long serviceTicketId) {
        ServiceTicketDetail entity = detailRepo.findByServiceTicket_Id(serviceTicketId)
                .orElseThrow(() -> new ResourceNotFoundException("No existe detalle para ServiceTicket con id: " + serviceTicketId));
        return mapper.toDto(entity);
    }
}
