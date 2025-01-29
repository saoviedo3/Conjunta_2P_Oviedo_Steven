package com.espe.micro_canciones.controller;

import com.espe.micro_canciones.models.entities.Cancion;
import com.espe.micro_canciones.services.CancionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/canciones")
public class CancionController {

    private final CancionService cancionService;

    public CancionController(CancionService cancionService) {
        this.cancionService = cancionService;
    }

    @GetMapping
    public ResponseEntity<List<Cancion>> obtenerTodasLasCanciones() {
        List<Cancion> canciones = cancionService.listarCanciones();
        return ResponseEntity.ok(canciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCancionPorId(@PathVariable Long id) {
        try {
            Cancion cancion = cancionService.buscarPorId(id);
            return ResponseEntity.ok(cancion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearCancion(@Valid @RequestBody Cancion cancion) {
        try {
            Cancion nuevaCancion = cancionService.crearCancion(cancion);
            return ResponseEntity.status(201).body(nuevaCancion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCancion(@PathVariable Long id, @Valid @RequestBody Cancion cancionDetalles) {
        try {
            Cancion cancionActualizada = cancionService.actualizarCancion(id, cancionDetalles);
            return ResponseEntity.ok(cancionActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarCancion(@PathVariable Long id) {
        try {
            cancionService.eliminarCancion(id);
            return ResponseEntity.ok("Canción eliminada exitosamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
