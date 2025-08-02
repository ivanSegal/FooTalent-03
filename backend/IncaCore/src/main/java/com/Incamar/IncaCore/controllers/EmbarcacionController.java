package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.embarcacion.*;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.services.IEmbarcacionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/embarcaciones")
@Tag(name = "02 - Embarcaciones",
        description = "Endpoints para gestión de embarcaciones")
public class EmbarcacionController {

    @Autowired
    private IEmbarcacionService embarcacionService;

    @GetAllEmbarcacionesEndpointDoc
    @GetMapping
    public ResponseEntity<List<Embarcacion>> getAllEmbarcaciones() {
        return ResponseEntity.ok(embarcacionService.getAllEmbarcaciones());
    }

    @GetEmbarcacionByIdEndpointDoc
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
    @PostMapping
    public ResponseEntity<String> createEmbarcacion(@Valid @RequestBody Embarcacion embarcacion) {
        embarcacionService.createEmbarcacion(
                embarcacion.getNombre(),
                embarcacion.getNPatente(),
                embarcacion.getCapitan(),
                embarcacion.getModelo()
        );
        return ResponseEntity.ok("Embarcación creada correctamente.");
    }

    @DeleteEmbarcacionEndpointDoc
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmbarcacion(@PathVariable Long id) {
        embarcacionService.deleteEmbarcacionById(id);
        return ResponseEntity.ok("Embarcación eliminada correctamente.");
    }

    @UpdateEmbarcacionEndpointDoc
    @PutMapping("/{id}")
    public ResponseEntity<Embarcacion> editEmbarcacion(@PathVariable Long id,
                                                       @Valid @RequestBody Embarcacion embarcacion) {
        Embarcacion updatedEmbarcacion = embarcacionService.editEmbarcacion(id, embarcacion);
        return ResponseEntity.ok(updatedEmbarcacion);
    }
}
