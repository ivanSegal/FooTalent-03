package com.Incamar.IncaCore.controllers;


import com.Incamar.IncaCore.documentation.boletaServicio.*;
import com.Incamar.IncaCore.dtos.boletaServicio.BoletaServicioRequestDto;
import com.Incamar.IncaCore.dtos.boletaServicio.BoletaServicioResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.services.BoletaServicioService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
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
public class BoletaServicioController {

    private final BoletaServicioService boleta;

    @GetAllBoletaServicioEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR','ADMINISTRATIVO')")
    @GetMapping
    public ResponseEntity<Page<BoletaServicioResponseDto>> getAll(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(boleta.getAllBoletasServicio(pageable));
    }

    @GetBoletaServicioByIdEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR','ADMINISTRATIVO')")
    @GetMapping("/{id}")
    public ResponseEntity<BoletaServicioResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(boleta.getBoletaServicioById(id));
    }

    @CreateBoletaServicioEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR')")
    @PostMapping
    public ResponseEntity<ApiResult<?>> create(
            @Validated(BoletaServicioRequestDto.Create.class) @RequestBody BoletaServicioRequestDto dto,
            Authentication authentication
    ) {
        JwtDataDto jwtDataDto = (JwtDataDto) authentication.getPrincipal();
        BoletaServicioResponseDto created = boleta.createBoletaServicio(dto, jwtDataDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(created, "Boleta de servicio creada correctamente."));
    }

    @UpdateBoletaServicioEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR')")
    @PutMapping("/{id}")
    public ResponseEntity<BoletaServicioResponseDto> update(
            @PathVariable Long id,
            @Validated(BoletaServicioRequestDto.Update.class) @RequestBody BoletaServicioRequestDto dto
    ) {
        BoletaServicioResponseDto updated = boleta.editBoletaServicio(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteBoletaServicioEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boleta.deleteBoletaServicioById(id);
        return ResponseEntity.noContent().build();
    }

    @SearchBoletaServicioByBoatEndpointDoc
    @PreAuthorize("hasAnyRole('ADMIN','PATRON','SUPERVISOR','ADMINISTRATIVO')")
    @GetMapping("/search")
    public ResponseEntity<Page<BoletaServicioResponseDto>> searchByBoat(
            @RequestParam("boatName") String boatName,
            @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(boleta.searchBoletaServicioByBoat(boatName, pageable));
    }
}
