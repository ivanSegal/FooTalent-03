package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.VesselItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VesselItemRepository extends JpaRepository<VesselItem,Long> {

    @Query("""
    SELECT vi
    FROM VesselItem vi
    WHERE (:vesselId IS NULL OR vi.vessel.id = :vesselId)
      AND (COALESCE(:vesselName, '') = '' OR LOWER(vi.vessel.name) LIKE LOWER(CONCAT('%', :vesselName, '%')))
""")
    Page<VesselItem> findByVesselIdOrVesselName(
            @Param("vesselId") Long vesselId,
            @Param("vesselName") String vesselName,
            Pageable pageable
    );

    List<VesselItem> findByVesselId(Long vesselId);



}
