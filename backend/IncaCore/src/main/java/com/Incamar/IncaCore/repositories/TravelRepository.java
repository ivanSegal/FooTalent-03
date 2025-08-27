package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.Travel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelRepository extends JpaRepository<Travel, Long> {

    List<Travel> findByServiceTicketDetail_Id(Long detailId);
}
