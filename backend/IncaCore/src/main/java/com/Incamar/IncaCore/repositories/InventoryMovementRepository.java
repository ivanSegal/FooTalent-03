package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.InventoryMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    Page<InventoryMovement> findByItemWarehouse_NameContainingIgnoreCase(String name, Pageable pageable);
}
