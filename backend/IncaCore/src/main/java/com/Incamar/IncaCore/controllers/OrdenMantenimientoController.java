package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.embarcacion.SearchEmbarcacionesEndpointDoc;
import com.Incamar.IncaCore.documentation.ordenMantenimiento.*;
import com.Incamar.IncaCore.dtos.ordenMantenimiento.OrdenMantenimientoRequestDto;
import com.Incamar.IncaCore.dtos.ordenMantenimiento.OrdenMantenimientoResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.services.IOrdenMantenimientoService;
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
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenes-mantenimiento")
@RequiredArgsConstructor
@Tag(name = "04 - Ordenes de Mantenimiento", description = "Endpoints para la gestión de órdenes de mantenimiento de " +
        "embarcaciones")
public class OrdenMantenimientoController {
    private final IOrdenMantenimientoService ordenService;

    @GetAllOrdenesMantenimientoEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<OrdenMantenimientoResponseDto>> getAllOrdenes(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(ordenService.getAllOrdenesMantenimiento(pageable));
    }

    @GetOrdenMantenimientoByIdEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<OrdenMantenimientoResponseDto> getOrdenById(@PathVariable Long id) {
        OrdenMantenimientoResponseDto ordenMantenimiento = ordenService.getOrdenMantenimientoById(id);
        if(ordenMantenimiento !=null) {
            return ResponseEntity.ok(ordenMantenimiento);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CreateOrdenMantenimientoEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResult<?>> createOrdenMantenimiento(@Validated(OrdenMantenimientoRequestDto.Create.class) @RequestBody OrdenMantenimientoRequestDto dto
            , Authentication authentication) {
        JwtDataDto jwtDataDto = (JwtDataDto) authentication.getPrincipal();
        OrdenMantenimientoResponseDto createdOrden = ordenService.createOrdenMantenimiento(dto, jwtDataDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResult.success(createdOrden,
                "Orden de mantenimiento creada correctamente."));
    }

    @DeleteOrdenMantenimientoEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrdenMantenimiento(@PathVariable Long id) {
        ordenService.deleteOrdenMantenimientoById(id);
        return ResponseEntity.noContent().build();
    }

    @UpdateOrdenMantenimientoEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> editOrden(@PathVariable Long id, @Valid @RequestBody OrdenMantenimientoRequestDto dto) {
        OrdenMantenimientoResponseDto updatedOrden = ordenService.editOrdenMantenimiento(id, dto);
        return ResponseEntity.ok(updatedOrden);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @SearchOrdenesMantenimientoEndpointDoc
    @GetMapping("/search")
    public ResponseEntity<Page<?>> searchOrdenMantenimientoPorEmbarcacion(@RequestParam("nombre") String nombre,
                                                       @ParameterObject Pageable pageable) {
        Page<OrdenMantenimientoResponseDto> result = ordenService.searchOrdenMantenimientoPorEmbarcacion(nombre, pageable);
        return ResponseEntity.ok(result);
    }

}
