package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.InventoryMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {

    @Query("SELECT DISTINCT im FROM InventoryMovement im " +
            "JOIN MovementDetails md ON md.inventoryMovement = im " +
            "JOIN md.itemWarehouse iw " +
            "WHERE LOWER(iw.name) LIKE LOWER(CONCAT('%', :itemName, '%'))")
    Page<InventoryMovement> findByItemWarehouseName(@Param("itemName") String itemName, Pageable pageable);
}
