package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ServiceTicketDetailService {

    ServiceTicketDetailResponseDto create(ServiceTicketDetailRequestDto dto);

    ServiceTicketDetailResponseDto getById(Long id);

    ServiceTicketDetailResponseDto update(Long id, ServiceTicketDetailRequestDto dto);

    void delete(Long id);

    Page<ServiceTicketDetailResponseDto> getAll(Pageable pageable);

    ServiceTicketDetailResponseDto getByServiceTicketId(Long serviceTicketId);
}
