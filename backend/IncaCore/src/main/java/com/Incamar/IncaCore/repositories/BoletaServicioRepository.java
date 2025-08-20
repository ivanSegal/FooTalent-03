package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.BoletaServicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoletaServicioRepository extends JpaRepository<BoletaServicio,Long> {

    Page<BoletaServicio> findBySolicitedByContainingIgnoreCase(String solicitor, Pageable pageable);
    Page<BoletaServicio> findByVesselAttendedContainingIgnoreCase(String vesselAttended,Pageable pageable);
    Page<BoletaServicio> findByBoat_NameContainingIgnoreCase(String name, Pageable pageable);

}
