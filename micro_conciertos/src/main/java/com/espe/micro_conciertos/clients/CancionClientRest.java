package com.espe.micro_conciertos.clients;

import com.espe.micro_conciertos.models.entities.Cancion;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "micro-canciones", url = "http://localhost:8004/api/canciones")
public interface CancionClientRest {

    // Obtener una canción por su ID
    @GetMapping("/{id}")
    Cancion findById(@PathVariable("id") Long id);
}

