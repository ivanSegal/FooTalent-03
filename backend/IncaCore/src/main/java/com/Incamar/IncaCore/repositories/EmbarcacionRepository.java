package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.Embarcacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmbarcacionRepository extends JpaRepository<Embarcacion,Long> {

    Page<Embarcacion> findByNombreContainingIgnoreCase(String nombreParcial, Pageable pageable);

}
