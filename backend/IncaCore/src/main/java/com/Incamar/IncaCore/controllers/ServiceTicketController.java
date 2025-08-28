package com.Incamar.IncaCore.controllers;


import com.Incamar.IncaCore.documentation.serviceTicket.*;
import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketResponseDto;
import com.Incamar.IncaCore.services.impl.ServiceTicketServiceImpl;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/boleta-servicio")
@Tag(name = "08 - Boleta de servicio", description = "Endpoints para la gestión de boletas de servicio para embarcaciones.")
@RequiredArgsConstructor
public class ServiceTicketController {

    private final ServiceTicketServiceImpl ticket;

    @GetAllServiceTicketEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping
    public ResponseEntity<Page<ServiceTicketResponseDto>> getAll(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(ticket.getAllBoletasServicio(pageable));
    }

    @GetServiceTicketByIdEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceTicketResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ticket.getBoletaServicioById(id));
    }

    @CreateServiceTicketEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @PostMapping
    public ResponseEntity<ApiResult<?>> create(
            @Validated(ServiceTicketRequestDto.Create.class) @RequestBody ServiceTicketRequestDto dto) {
        ServiceTicketResponseDto created = ticket.createBoletaServicio(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(created, "Boleta de servicio creada correctamente."));
    }

    @UpdateServiceTicketEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL')")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceTicketResponseDto> update(
            @PathVariable Long id,
            @Validated(ServiceTicketRequestDto.Update.class) @RequestBody ServiceTicketRequestDto dto
    ) {
        ServiceTicketResponseDto updated = ticket.editBoletaServicio(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteServiceTicketEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ticket.deleteBoletaServicioById(id);
        return ResponseEntity.noContent().build();
    }

    @SearchServiceTicketByBoatEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping("/search")
    public ResponseEntity<Page<ServiceTicketResponseDto>> searchByBoat(
            @RequestParam("vesselName") String vesselName,
            @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(ticket.searchBoletaServicioByBoat(vesselName, pageable));
    }
}
