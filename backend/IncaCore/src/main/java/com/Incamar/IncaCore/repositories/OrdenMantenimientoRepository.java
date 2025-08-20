package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.OrdenMantenimiento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenMantenimientoRepository  extends JpaRepository<OrdenMantenimiento, Long> {
    Page<OrdenMantenimiento> findByVessel_NameContainingIgnoreCase(String nombreParcial, Pageable pageable);
}
