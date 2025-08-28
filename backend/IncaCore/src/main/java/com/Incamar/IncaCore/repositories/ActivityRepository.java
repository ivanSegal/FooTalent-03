package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long>{
    Page<Activity> findByMaintenanceOrder_Id(Long maintenanceOrderId, Pageable pageable);
    Page<Activity> findByMaintenanceOrder_Vessel_NameContainingIgnoreCase(String partialName, Pageable pageable);
    Page<Activity> findByActivityTypeContainingIgnoreCase(String activityType, Pageable pageable);
}
