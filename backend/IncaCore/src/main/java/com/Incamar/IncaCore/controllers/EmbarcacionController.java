package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.embarcacion.*;
import com.Incamar.IncaCore.documentation.user.SearchUsersEndpointDoc;
import com.Incamar.IncaCore.dtos.users.UserResponseDto;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.services.IEmbarcacionService;
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

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/embarcaciones")
@Tag(name = "03 - Embarcaciones",
        description = "Endpoints para gestión de embarcaciones")
public class EmbarcacionController {

    private final IEmbarcacionService embarcacionService;

    @GetAllEmbarcacionesEndpointDoc
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'OPERATIONS_MANAGER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<Page<Embarcacion>> getAllEmbarcaciones(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(embarcacionService.getAllEmbarcaciones(pageable));
    }

    @GetEmbarcacionByIdEndpointDoc
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'OPERATIONS_MANAGER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Embarcacion> getEmbarcacionById(@PathVariable Long id) {
        Embarcacion embarcacion = embarcacionService.getEmbarcacionById(id);
        if (embarcacion != null) {
            return ResponseEntity.ok(embarcacion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CreateEmbarcacionEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<String> createEmbarcacion(@Valid @RequestBody Embarcacion embarcacion) {
        embarcacionService.createEmbarcacion(
                embarcacion.getName(),
                embarcacion.getNPatente(),
                embarcacion.getCapitan(),
                embarcacion.getModelo()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Embarcación creada correctamente.");
    }

    @DeleteEmbarcacionEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmbarcacion(@PathVariable Long id) {
        embarcacionService.deleteEmbarcacionById(id);
        return ResponseEntity.noContent().build();
    }

    @UpdateEmbarcacionEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Embarcacion> editEmbarcacion(@PathVariable Long id,
                                                       @Valid @RequestBody Embarcacion boat) {
        Embarcacion updatedEmbarcacion = embarcacionService.editEmbarcacion(id, boat);
        return ResponseEntity.ok(updatedEmbarcacion);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @SearchEmbarcacionesEndpointDoc
    @GetMapping("/search")
    public ResponseEntity<Page<Embarcacion>> searchEmbarcaciones(@RequestParam("nombre") String nombre, @ParameterObject Pageable pageable) {
        Page<Embarcacion> result = embarcacionService.searchEmbarcacionesByName(nombre, pageable);
        return ResponseEntity.ok(result);
    }
}
