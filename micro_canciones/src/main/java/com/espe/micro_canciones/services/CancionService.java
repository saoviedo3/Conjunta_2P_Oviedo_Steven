package com.espe.micro_canciones.services;

import com.espe.micro_canciones.models.entities.Cancion;

import java.util.List;

public interface CancionService {

    // Crear una nueva canción
    Cancion crearCancion(Cancion cancion);

    // Listar todas las canciones
    List<Cancion> listarCanciones();

    // Buscar una canción por ID
    Cancion buscarPorId(Long id);

    // Buscar canciones por título
    List<Cancion> buscarPorTitulo(String titulo);

    // Buscar canciones por artista
    List<Cancion> buscarPorArtista(String artista);

    // Eliminar una canción por ID
    void eliminarCancion(Long id);

    // Actualizar una canción existente
    Cancion actualizarCancion(Long id, Cancion cancionDetalles);

}
