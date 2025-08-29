package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.ItemWarehouse;
import com.Incamar.IncaCore.models.Stock;
import com.Incamar.IncaCore.models.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Integer> {
    Optional<Stock> findById(Long id);

    Page<Stock> findByItemWarehouse_NameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsByItemWarehouseAndWarehouse(ItemWarehouse itemWarehouse, Warehouse warehouse);

    List<Stock> findByItemWarehouse(ItemWarehouse itemWarehouse);

    Optional<Stock> findByWarehouseIdAndItemWarehouseId(Long warehouseId, Long itemWarehouseId);
}
