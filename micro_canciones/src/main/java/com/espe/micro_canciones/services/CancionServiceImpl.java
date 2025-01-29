package com.espe.micro_canciones.services;

import com.espe.micro_canciones.models.entities.Cancion;
import com.espe.micro_canciones.repositories.CancionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CancionServiceImpl implements CancionService {

    private final CancionRepository cancionRepository;

    public CancionServiceImpl(CancionRepository cancionRepository) {
        this.cancionRepository = cancionRepository;
    }

    @Override
    public Cancion crearCancion(Cancion cancion) {
        // Validar si ya existe una canción con el mismo título y artista
        List<Cancion> cancionesExistentes = cancionRepository.findByTituloContainingIgnoreCase(cancion.getTitulo());
        for (Cancion c : cancionesExistentes) {
            if (c.getArtista().equalsIgnoreCase(cancion.getArtista())) {
                throw new RuntimeException("Ya existe una canción con el mismo título y artista");
            }
        }

        cancion.setFechaCreacion(LocalDateTime.now());
        return cancionRepository.save(cancion);
    }

    @Override
    public List<Cancion> listarCanciones() {
        return cancionRepository.findAll();
    }

    @Override
    public Cancion buscarPorId(Long id) {
        return cancionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Canción no encontrada con ID: " + id));
    }

    @Override
    public List<Cancion> buscarPorTitulo(String titulo) {
        return cancionRepository.findByTituloContainingIgnoreCase(titulo);
    }

    @Override
    public List<Cancion> buscarPorArtista(String artista) {
        return cancionRepository.findByArtistaContainingIgnoreCase(artista);
    }

    @Override
    public void eliminarCancion(Long id) {
        Cancion cancion = buscarPorId(id);
        cancionRepository.delete(cancion);
    }

    @Override
    public Cancion actualizarCancion(Long id, Cancion cancionDetalles) {
        Cancion cancion = buscarPorId(id);

        // Validar que no se está duplicando una canción existente
        List<Cancion> cancionesExistentes = cancionRepository.findByTituloContainingIgnoreCase(cancionDetalles.getTitulo());
        for (Cancion c : cancionesExistentes) {
            if (!c.getId().equals(id) && c.getArtista().equalsIgnoreCase(cancionDetalles.getArtista())) {
                throw new RuntimeException("Ya existe una canción con el mismo título y artista");
            }
        }

        cancion.setTitulo(cancionDetalles.getTitulo());
        cancion.setArtista(cancionDetalles.getArtista());
        cancion.setDuracion(cancionDetalles.getDuracion());

        return cancionRepository.save(cancion);
    }
}
