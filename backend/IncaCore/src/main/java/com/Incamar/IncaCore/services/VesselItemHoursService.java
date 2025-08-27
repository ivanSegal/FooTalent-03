package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursReq;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursRes;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursUpdateReq;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VesselItemHoursService {

    VesselItemHoursRes getById(Long id);

    Object create(VesselItemHoursReq request);

    Page<VesselItemHoursRes> getAll(Pageable pageable);

    @Transactional
    void update(Long id, VesselItemHoursUpdateReq request);


}
