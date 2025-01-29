package com.espe.micro_conciertos.repositories;

import com.espe.micro_conciertos.models.entities.Concierto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ConciertoRepository extends JpaRepository<Concierto, Long> {

}
