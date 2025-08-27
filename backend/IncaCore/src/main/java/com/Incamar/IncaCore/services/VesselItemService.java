package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.vesselItem.VesselItemReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemRes;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemSearchReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemUpdateReq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface VesselItemService {

    Page<VesselItemRes> getAllWithSearch(VesselItemSearchReq request, Pageable pageable);

    VesselItemRes getById(Long id);

    void create(VesselItemReq request);

    void update(Long id, VesselItemUpdateReq request);
}
