package com.espe.micro_conciertos.models.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "concierto_canciones")
public class ConciertoCancion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "concierto_id", nullable = false)
    @JsonBackReference
    private Concierto concierto;

    @NotNull(message = "El ID de la canción no puede ser nulo.")
    @Column(name = "cancion_id", nullable = false)
    private Long cancionId;

    public ConciertoCancion() {}

    public ConciertoCancion(Concierto concierto, Long cancionId) {
        this.concierto = concierto;
        this.cancionId = cancionId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Concierto getConcierto() {
        return concierto;
    }

    public void setConcierto(Concierto concierto) {
        this.concierto = concierto;
    }

    public Long getCancionId() {
        return cancionId;
    }

    public void setCancionId(Long cancionId) {
        this.cancionId = cancionId;
    }
}
