package com.espe.micro_conciertos.models.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "canciones")
public class Cancion {

    @Id
    private Long id; // Este ID debe coincidir con el ID del microservicio micro_canciones

    @Column(nullable = false)
    private String titulo;

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
}
