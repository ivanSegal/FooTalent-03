package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ServiceTicketService {

    Page<ServiceTicketResponseDto> getAllBoletasServicio(Pageable pageable);

    ServiceTicketResponseDto getBoletaServicioById(Long id);

    ServiceTicketResponseDto createBoletaServicio(ServiceTicketRequestDto requestDto);

    ServiceTicketResponseDto editBoletaServicio(Long id, ServiceTicketRequestDto requestDto);

    void deleteBoletaServicioById(Long id);

    Page<ServiceTicketResponseDto> searchBoletaServicioByBoat(String boatName, Pageable pageable);

}
