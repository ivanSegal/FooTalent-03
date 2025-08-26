package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.serviceTicketDetail.*;
import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailResponseDto;
import com.Incamar.IncaCore.services.impl.ServiceTicketDetailServiceImpl;

import com.Incamar.IncaCore.utils.ApiResult;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/boleta-servicio-detalle")
@RequiredArgsConstructor
public class ServiceTicketDetailController {

    private final ServiceTicketDetailServiceImpl serviceTicketDetailService;

    @GetAllServiceTicketDetailsEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','OPERADOR','SUPERVISOR')")
    @GetMapping
    public ResponseEntity<Page<ServiceTicketDetailResponseDto>> getAll(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(serviceTicketDetailService.getAll(pageable));
    }

    @GetByIdServiceTicketDetailsEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','OPERADOR','SUPERVISOR')")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceTicketDetailResponseDto> getSTDetailById(@PathVariable Long id){
        return ResponseEntity.ok(serviceTicketDetailService.getById(id));
    }


        @CreateServiceTicketDetailEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','OPERADOR','SUPERVISOR')")
    @PostMapping
    public ResponseEntity<ApiResult<?>> createServiceTicketDetail(
            @Validated(ServiceTicketRequestDto.Create.class) @RequestBody ServiceTicketDetailRequestDto dto) {

        ServiceTicketDetailResponseDto created = serviceTicketDetailService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(created, "Detalles de la boleta de servicio creados correctamente."));
    }

    @UpdateServiceTicketDetailEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR')")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceTicketDetailResponseDto> update(
            @PathVariable Long id,
            @Validated(ServiceTicketDetailRequestDto.Update.class) @RequestBody ServiceTicketDetailRequestDto dto) {
        ServiceTicketDetailResponseDto updated = serviceTicketDetailService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteServiceTicketDetailEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceTicketDetailService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetByServiceTicketIdEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','OPERADOR','SUPERVISOR')")
    @GetMapping("/by-ticket/{ticketId}")
    public ResponseEntity<ServiceTicketDetailResponseDto> getByServiceTicketId(@PathVariable Long ticketId) {
        return ResponseEntity.ok(serviceTicketDetailService.getByServiceTicketId(ticketId));
    }

}
