package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.MaintenanceOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceOrderRepository extends JpaRepository<MaintenanceOrder, Long> {
    Page<MaintenanceOrder> findByVessel_NameContainingIgnoreCase(String partialName, Pageable pageable);
}
