package com.Incamar.IncaCore.controllers;


import com.Incamar.IncaCore.documentation.serviceTicket.*;
import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.services.ServiceTicketService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boleta-servicio")
@Tag(name = "05 - Boleta de servicio", description = "Endpoints para la gestión de boletas de servicio para embarcaciones.")
@RequiredArgsConstructor
public class ServiceTicketController {

    private final ServiceTicketService boleta;

    @GetAllServiceTicketEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR','ADMINISTRATIVO')")
    @GetMapping
    public ResponseEntity<Page<ServiceTicketResponseDto>> getAll(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(boleta.getAllBoletasServicio(pageable));
    }

    @GetServiceTicketByIdEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR','ADMINISTRATIVO')")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceTicketResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(boleta.getBoletaServicioById(id));
    }

    @CreateServiceTicketEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR')")
    @PostMapping
    public ResponseEntity<ApiResult<?>> create(
            @Validated(ServiceTicketRequestDto.Create.class) @RequestBody ServiceTicketRequestDto dto,
            Authentication authentication
    ) {
        JwtDataDto jwtDataDto = (JwtDataDto) authentication.getPrincipal();
        ServiceTicketResponseDto created = boleta.createBoletaServicio(dto, jwtDataDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(created, "Boleta de servicio creada correctamente."));
    }

    @UpdateServiceTicketEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR')")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceTicketResponseDto> update(
            @PathVariable Long id,
            @Validated(ServiceTicketRequestDto.Update.class) @RequestBody ServiceTicketRequestDto dto
    ) {
        ServiceTicketResponseDto updated = boleta.editBoletaServicio(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteServiceTicketEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boleta.deleteBoletaServicioById(id);
        return ResponseEntity.noContent().build();
    }

    @SearchServiceTicketByBoatEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR','ADMINISTRATIVO')")
    @GetMapping("/search")
    public ResponseEntity<Page<ServiceTicketResponseDto>> searchByBoat(
            @RequestParam("boatName") String boatName,
            @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(boleta.searchBoletaServicioByBoat(boatName, pageable));
    }
}
