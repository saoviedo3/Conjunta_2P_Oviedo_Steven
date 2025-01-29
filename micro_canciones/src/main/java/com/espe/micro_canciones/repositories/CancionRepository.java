package com.espe.micro_canciones.repositories;

import com.espe.micro_canciones.models.entities.Cancion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CancionRepository extends JpaRepository<Cancion, Long> {

    // Consulta para buscar canciones por título
    List<Cancion> findByTituloContainingIgnoreCase(String titulo);

    // Consulta para buscar canciones por artista
    List<Cancion> findByArtistaContainingIgnoreCase(String artista);
}
