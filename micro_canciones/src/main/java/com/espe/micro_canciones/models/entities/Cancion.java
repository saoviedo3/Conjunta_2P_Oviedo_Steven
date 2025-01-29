package com.espe.micro_canciones.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "canciones", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"titulo", "artista"}) // Evita duplicados de título y artista
})
public class Cancion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "El título no puede estar vacío")
    @Size(min = 2, max = 100, message = "El título debe tener entre 2 y 100 caracteres")
    private String titulo;

    @Column(nullable = false)
    @NotBlank(message = "El nombre del artista no puede estar vacío")
    @Size(min = 2, max = 100, message = "El nombre del artista debe tener entre 2 y 100 caracteres")
    private String artista;

    @Column(nullable = false)
    @Min(value = 10, message = "La duración debe ser de al menos 10 segundos")
    private Integer duracion;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getArtista() {
        return artista;
    }

    public void setArtista(String artista) {
        this.artista = artista;
    }

    public Integer getDuracion() {
        return duracion;
    }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    // Callback para establecer la fecha de creación automáticamente
    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
