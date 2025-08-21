package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.vessel.*;
import com.Incamar.IncaCore.dtos.vessels.VesselRequestDto;
import com.Incamar.IncaCore.dtos.vessels.VesselResponseDto;
import com.Incamar.IncaCore.services.vessel.IVesselService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vassels")
@Tag(name = "03 - Embarcaciones",
        description = "Endpoints para gestión de embarcaciones")
public class VesselController {

    private final IVesselService vesselService;

    @GetAllEmbarcacionesEndpointDoc
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'OPERATIONS_MANAGER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResult<?>> getAllVessel(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(ApiResult.success(vesselService.getAllVessels(pageable),"Se visualizan exitosamente todas las embarcaciones."));
    }

    @GetEmbarcacionByIdEndpointDoc
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'OPERATIONS_MANAGER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<?>> getVesselById(@PathVariable Long id) {
        VesselResponseDto vesselResponseDto = vesselService.getVesselById(id);
        return ResponseEntity.ok(ApiResult.success(vesselResponseDto,"Embarcacion obtenida exitosamente."));
    }

    @CreateEmbarcacionEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ApiResult<?>> createVessel(@Valid @RequestBody VesselRequestDto vesselRequestDto) {
        VesselResponseDto vesselResponseDto = vesselService.createVessel(vesselRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(vesselResponseDto,"Embarcación creada correctamente."));
    }

    @DeleteEmbarcacionEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<?>> deleteEmbarcacion(@PathVariable Long id) {
        vesselService.deleteVesselById(id);
        return ResponseEntity.ok(ApiResult.success("Embarcacion eliminada exitosamente."));
    }

    @UpdateEmbarcacionEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<?>> editEmbarcacion(@PathVariable Long id,
                                                  @Valid @RequestBody VesselRequestDto vesselRequestDto) {
        VesselResponseDto vesselResponseDto = vesselService.editEmbarcacion(id, vesselRequestDto);
        return ResponseEntity.ok(ApiResult.success(vesselResponseDto,"Embarcacion editada exitosamente."));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @SearchEmbarcacionesEndpointDoc
    @GetMapping("/search")
    public ResponseEntity<ApiResult<?>> searchEmbarcaciones(@RequestParam("nombre") String nombre, @ParameterObject Pageable pageable) {
        Page<VesselResponseDto> result = vesselService.searchVesselByName(nombre, pageable);
        return ResponseEntity.ok(ApiResult.success(result,"Embarcaciones obtenidas exitosamente."));
    }
}
