package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.Embarcacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmbarcacionRepository extends JpaRepository<Embarcacion,Long> {
}
