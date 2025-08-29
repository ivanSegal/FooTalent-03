package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.InventoryMovement;
import com.Incamar.IncaCore.models.MovementDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovementDetailsRepository extends JpaRepository<MovementDetails, Long> {
    List<MovementDetails> findByInventoryMovementId(Long id);

}
