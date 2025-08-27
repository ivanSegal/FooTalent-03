package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.vesselItem.VesselItemReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemRes;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemSearchReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemUpdateReq;
import com.Incamar.IncaCore.enums.MaterialType;
import com.Incamar.IncaCore.mappers.VesselItemMapper;
import com.Incamar.IncaCore.models.Vessel;
import com.Incamar.IncaCore.models.VesselItem;
import com.Incamar.IncaCore.repositories.VesselItemRepository;
import com.Incamar.IncaCore.repositories.VesselRepository;
import com.Incamar.IncaCore.services.VesselItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class VesselItemServiceImpl implements VesselItemService {

    private final VesselItemRepository vesselItemRepository;
    private final VesselItemMapper vesselItemMapper;

    private final VesselRepository vesselRepository;

    @Override
    public Page<VesselItemRes> getAllWithSearch(VesselItemSearchReq request, Pageable pageable) {
        Page<VesselItem> vasselItem = vesselItemRepository.findByVesselIdOrVesselName(request.vesselId(), request.vesselName(), pageable);
        return vesselItemMapper.toVesselItemRes(vasselItem);
    }

    @Override
    public VesselItemRes getById(Long id){
        VesselItem vesselItem = vesselItemRepository.findById(id).
                orElseThrow();
        return vesselItemMapper.toVesselItemRes(vesselItem);
    }

    @Override
    public void create(VesselItemReq request) {

        VesselItem vesselItem = vesselItemMapper.toVesselItem(request);

        Vessel vessel = vesselRepository.findById(request.vesselId()).orElseThrow();
        vesselItem.setVessel(vessel);

        if(request.componentId()!=null && request.materialType().equals(MaterialType.SUBCOMPONENTS)){
            VesselItem component = vesselItemRepository.findById(request.componentId()).orElseThrow();
            vesselItem.setComponent(component);
        }

        vesselItemRepository.save(vesselItem);
    }

    @Override
    public void update(Long id, VesselItemUpdateReq request){
        VesselItem vesselItem = vesselItemRepository.findById(id).orElseThrow();
        vesselItemMapper.update(request, vesselItem);
        vesselItemRepository.save(vesselItem);
    }
}
