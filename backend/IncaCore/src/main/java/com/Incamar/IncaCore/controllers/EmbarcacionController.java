package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.services.IEmbarcacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/embarcaciones")
public class EmbarcacionController {

    @Autowired
    private IEmbarcacionService embarcacionService;

    // GET: Obtener todas las embarcaciones
    @GetMapping
    public ResponseEntity<List<Embarcacion>> getAllEmbarcaciones() {
        return ResponseEntity.ok(embarcacionService.getAllEmbarcaciones());
    }

    // GET: Obtener embarcacion por ID
    @GetMapping("/{id}")
    public ResponseEntity<Embarcacion> getEmbarcacionById(@PathVariable Long id) {
        Embarcacion embarcacion = embarcacionService.getEmbarcacionById(id);
        if (embarcacion != null) {
            return ResponseEntity.ok(embarcacion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Crear una nueva embarcacion
    @PostMapping
    public ResponseEntity<String> createEmbarcacion(@Valid @RequestBody Embarcacion embarcacion) {
        embarcacionService.createEmbarcacion(
                embarcacion.getNombre(),
                embarcacion.getNPatente(),
                embarcacion.getCapitan(),
                embarcacion.getModelo()
        );
        return ResponseEntity.ok("Embarcacion creada correctamente.");
    }

    // DELETE: Eliminar una embarcacion por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmbarcacion(@PathVariable Long id) {
        embarcacionService.deleteEmbarcacionById(id);
        return ResponseEntity.ok("Embarcacion eliminada correctamente.");
    }

    // PUT: Editar una embarcacion
    @PutMapping("/{id}")
    public ResponseEntity<Embarcacion> editEmbarcacion(@PathVariable Long id,
                                                       @Valid @RequestBody Embarcacion embarcacion) {
        Embarcacion updatedEmbarcacion = embarcacionService.editEmbarcacion(id, embarcacion);
        return ResponseEntity.ok(updatedEmbarcacion);
    }
}
