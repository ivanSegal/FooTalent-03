package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemWarehouseRepository extends JpaRepository<ItemWarehouse , Long> {

    boolean existsItemWarehouseByName(String name);
    ItemWarehouse findItemWarehouseByName(String name);
    Page<ItemWarehouse> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
