package com.espe.micro_conciertos.services;

import com.espe.micro_conciertos.models.entities.Concierto;

import java.util.List;

public interface ConciertoService {
    // Crear un nuevo concierto
    Concierto crearConcierto(Concierto concierto);

    // Listar todos los conciertos
    List<Concierto> listarConciertos();

    // Buscar un concierto por su ID
    Concierto buscarPorId(Long id);

    // Actualizar un concierto
    Concierto actualizarConcierto(Long id, Concierto conciertoDetalles);

    // Eliminar un concierto por ID
    void eliminarConcierto(Long id);

    // Crear un concierto con canciones basadas en sus IDs
    Concierto crearConciertoConCanciones(Long conciertoId, List<Long> cancionesIds);

    // Eliminar una canción de un concierto
    void eliminarCancionDeConcierto(Long conciertoId, Long cancionId);

    // Método para agregar canciones a un concierto existente
    Concierto agregarCancionAConcierto(Long conciertoId, List<Long> cancionesIds);




}
