package com.espe.micro_conciertos.models.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "conciertos")
public class Concierto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del concierto no puede estar vacío.")
    @Column(nullable = false)
    private String nombre;

    @NotNull(message = "La fecha del concierto es obligatoria.")
    @Future(message = "La fecha del concierto debe estar en el futuro.")
    @Column(nullable = false)
    private LocalDateTime fecha;

    @OneToMany(mappedBy = "concierto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Evita el ciclo infinito de serialización
    private Set<ConciertoCancion> canciones = new HashSet<>();

    @Transient
    private List<Long> cancionesIds;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Set<ConciertoCancion> getCanciones() {
        return canciones;
    }

    public void setCanciones(Set<ConciertoCancion> canciones) {
        this.canciones = canciones;
    }

    public List<Long> getCancionesIds() {
        return cancionesIds;
    }

    public void setCancionesIds(List<Long> cancionesIds) {
        this.cancionesIds = cancionesIds;
    }
}
