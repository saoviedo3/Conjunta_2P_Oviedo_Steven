package com.espe.micro_conciertos.controller;

import com.espe.micro_conciertos.models.entities.Concierto;
import com.espe.micro_conciertos.services.ConciertoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conciertos")
public class ConciertoController {

    private final ConciertoService conciertoService;

    public ConciertoController(ConciertoService conciertoService) {
        this.conciertoService = conciertoService;
    }

    // Obtener todos los conciertos
    @GetMapping
    public ResponseEntity<List<Concierto>> obtenerTodosLosConciertos() {
        return ResponseEntity.ok(conciertoService.listarConciertos());
    }

    // Obtener un concierto por su ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerConciertoPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(conciertoService.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Crear un nuevo concierto
    @PostMapping
    public ResponseEntity<?> crearConcierto(@Valid @RequestBody Concierto concierto) {
        try {
            return ResponseEntity.status(201).body(conciertoService.crearConcierto(concierto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Actualizar un concierto
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarConcierto(@PathVariable Long id, @Valid @RequestBody Concierto conciertoDetalles) {
        try {
            return ResponseEntity.ok(conciertoService.actualizarConcierto(id, conciertoDetalles));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Eliminar un concierto
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarConcierto(@PathVariable Long id) {
        try {
            conciertoService.eliminarConcierto(id);
            return ResponseEntity.ok("Concierto eliminado con éxito.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Agregar canciones a un concierto usando solo IDs
    @PostMapping("/{id}/canciones")
    public ResponseEntity<?> agregarCancionAConcierto(@PathVariable Long id, @RequestBody List<Long> cancionesIds) {
        try {
            if (cancionesIds == null || cancionesIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Debe proporcionar al menos una canción.");
            }
            return ResponseEntity.status(201).body(conciertoService.agregarCancionAConcierto(id, cancionesIds));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    // Eliminar una canción de un concierto
    @DeleteMapping("/{id}/canciones/{cancionId}")
    public ResponseEntity<?> eliminarCancionDeConcierto(@PathVariable Long id, @PathVariable Long cancionId) {
        try {
            conciertoService.eliminarCancionDeConcierto(id, cancionId);
            return ResponseEntity.ok("Canción eliminada del concierto con éxito.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }



}
