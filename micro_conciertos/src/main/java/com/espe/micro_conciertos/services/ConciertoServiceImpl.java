package com.espe.micro_conciertos.services;

import com.espe.micro_conciertos.models.entities.Concierto;
import com.espe.micro_conciertos.models.entities.ConciertoCancion;
import com.espe.micro_conciertos.repositories.ConciertoRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ConciertoServiceImpl implements ConciertoService {

    private final ConciertoRepository conciertoRepository;

    public ConciertoServiceImpl(ConciertoRepository conciertoRepository) {
        this.conciertoRepository = conciertoRepository;
    }

    @Override
    public Concierto crearConcierto(Concierto concierto) {
        validarConcierto(concierto);

        // Verificar si ya existe un concierto con el mismo nombre
        boolean existe = conciertoRepository.findAll().stream()
                .anyMatch(c -> c.getNombre().equalsIgnoreCase(concierto.getNombre()));
        if (existe) {
            throw new RuntimeException("Ya existe un concierto con el mismo nombre.");
        }

        Set<ConciertoCancion> canciones = new HashSet<>();
        if (concierto.getCancionesIds() != null) {
            for (Long cancionId : concierto.getCancionesIds()) {
                canciones.add(new ConciertoCancion(concierto, cancionId));
            }
        }
        concierto.setCanciones(canciones);

        return conciertoRepository.save(concierto);
    }

    @Override
    public List<Concierto> listarConciertos() {
        List<Concierto> conciertos = conciertoRepository.findAll();

        for (Concierto concierto : conciertos) {
            List<Long> cancionesIds = concierto.getCanciones().stream()
                    .map(ConciertoCancion::getCancionId)
                    .toList();
            concierto.setCancionesIds(cancionesIds);
        }

        return conciertos;
    }

    @Override
    public Concierto buscarPorId(Long id) {
        Concierto concierto = conciertoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Concierto no encontrado con ID: " + id));

        List<Long> cancionesIds = concierto.getCanciones().stream()
                .map(ConciertoCancion::getCancionId)
                .toList();
        concierto.setCancionesIds(cancionesIds);

        return concierto;
    }

    @Override
    public Concierto actualizarConcierto(Long id, Concierto conciertoDetalles) {
        Concierto conciertoExistente = buscarPorId(id);
        validarConcierto(conciertoDetalles);

        conciertoExistente.setNombre(conciertoDetalles.getNombre());
        conciertoExistente.setFecha(conciertoDetalles.getFecha());
        return conciertoRepository.save(conciertoExistente);
    }

    @Override
    public void eliminarConcierto(Long id) {
        Concierto concierto = buscarPorId(id);
        conciertoRepository.delete(concierto);
    }

    @Override
    public Concierto crearConciertoConCanciones(Long conciertoId, List<Long> cancionesIds) {
        Concierto concierto = buscarPorId(conciertoId);

        if (cancionesIds == null || cancionesIds.isEmpty()) {
            throw new RuntimeException("La lista de canciones no puede estar vacía.");
        }

        Set<ConciertoCancion> canciones = new HashSet<>();
        for (Long cancionId : cancionesIds) {
            canciones.add(new ConciertoCancion(concierto, cancionId));
        }

        concierto.getCanciones().addAll(canciones);
        return conciertoRepository.save(concierto);
    }

    private void validarConcierto(Concierto concierto) {
        if (concierto.getNombre() == null || concierto.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre del concierto no puede estar vacío.");
        }
        if (concierto.getFecha() == null) {
            throw new RuntimeException("La fecha del concierto es obligatoria.");
        }
        if (concierto.getFecha().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("La fecha del concierto debe estar en el futuro.");
        }
    }

    @Override
    public void eliminarCancionDeConcierto(Long conciertoId, Long cancionId) {
        Concierto concierto = conciertoRepository.findById(conciertoId)
                .orElseThrow(() -> new RuntimeException("Concierto no encontrado con ID: " + conciertoId));

        boolean removed = concierto.getCanciones().removeIf(c -> c.getCancionId().equals(cancionId));

        if (!removed) {
            throw new RuntimeException("La canción con ID " + cancionId + " no está asignada a este concierto.");
        }

        conciertoRepository.save(concierto);
    }

    @Override
    public Concierto agregarCancionAConcierto(Long conciertoId, List<Long> cancionesIds) {
        Concierto concierto = buscarPorId(conciertoId);

        if (cancionesIds == null || cancionesIds.isEmpty()) {
            throw new RuntimeException("La lista de canciones no puede estar vacía.");
        }

        for (Long cancionId : cancionesIds) {
            if (concierto.getCanciones().stream().anyMatch(c -> c.getCancionId().equals(cancionId))) {
                throw new RuntimeException("La canción con ID " + cancionId + " ya está asignada al concierto.");
            }
            concierto.getCanciones().add(new ConciertoCancion(concierto, cancionId));
        }

        return conciertoRepository.save(concierto);
    }


}
