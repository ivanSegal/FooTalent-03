package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.ServiceTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceTicketRepository extends JpaRepository<ServiceTicket,Long> {

    Page<ServiceTicket> findBySolicitedByContainingIgnoreCase(String solicitor, Pageable pageable);
    Page<ServiceTicket> findByVesselAttendedContainingIgnoreCase(String vesselAttended, Pageable pageable);
    Page<ServiceTicket> findByBoat_NameContainingIgnoreCase(String name, Pageable pageable);

}
