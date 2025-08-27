package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.travel.*;
import com.Incamar.IncaCore.dtos.travel.TravelRequestDto;
import com.Incamar.IncaCore.dtos.travel.TravelResponseDto;
import com.Incamar.IncaCore.services.TravelService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/travels")
@Tag(name = "08 - Viajes realizados", description = "Endpoints para la carga de los horarios y destinos por viaje de la embarcación.")
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;

    @CreateTravelEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @PostMapping
    public ResponseEntity<TravelResponseDto> create(@Validated @RequestBody TravelRequestDto dto) {
        return ResponseEntity.ok(travelService.create(dto));
    }

    @GetTravelsByDetailEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping("/detail/{detailId}")
    public ResponseEntity<List<TravelResponseDto>> getByDetail(@PathVariable Long detailId) {
        return ResponseEntity.ok(travelService.getByDetailId(detailId));
    }

    @GetTotalHoursByDetailEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping("/detail/{detailId}/total-hours")
    public ResponseEntity<String> getTotalHours(@PathVariable Long detailId) {
        return ResponseEntity.ok(travelService.getTotalTraveledTime(detailId));
    }

    @UpdateTravelEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL')")
    @PutMapping("/{id}")
    public ResponseEntity<TravelResponseDto> update(
            @PathVariable Long id,
            @Validated @RequestBody TravelRequestDto dto) {
        return ResponseEntity.ok(travelService.update(id, dto));
    }

    @DeleteTravelEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        travelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

