package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursReq;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursRes;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursUpdateReq;
import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.VesselItemHoursMapper;
import com.Incamar.IncaCore.models.*;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.repositories.VesselItemHoursRepository;
import com.Incamar.IncaCore.repositories.VesselItemRepository;
import com.Incamar.IncaCore.repositories.VesselRepository;
import com.Incamar.IncaCore.services.AuthService;
import com.Incamar.IncaCore.services.EmailService;
import com.Incamar.IncaCore.services.VesselItemHoursService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VesselItemHoursServiceImpl implements VesselItemHoursService {

    private final AuthService authService;
    private final VesselRepository vesselRepository;
    private final VesselItemRepository vesselItemRepository;
    private final VesselItemHoursMapper vesselItemHoursMapper;
    private final VesselItemHoursRepository vesselItemHoursRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;


    @Override
    public Page<VesselItemHoursRes> getAll(Pageable pageable) {
        Page<VesselItemHours> vesselItemHours = vesselItemHoursRepository.findAll(pageable);
        return vesselItemHoursMapper.toDto(vesselItemHours);
    }

    @Override
    public VesselItemHoursRes getById(Long id){
        VesselItemHours entity = vesselItemHoursRepository.findById(id).orElseThrow();
        return vesselItemHoursMapper.toDto(entity);
    }

    @Transactional
    @Override
    public VesselItemHoursRes create(VesselItemHoursReq request) {
        User user = authService.getAuthenticatedUser()
                .orElseThrow(()-> new ResourceNotFoundException("Usuario no encontrado"));

        Vessel vessel = vesselRepository.findById(request.vesselId())
                .orElseThrow(()-> new ResourceNotFoundException("Embarcación no encontrada con ID: " + request.vesselId()));

        List<VesselItem> vesselItems = vesselItemRepository.findByVesselId(vessel.getId());

        VesselItemHours entity = vesselItemHoursMapper.toEntity(request, vessel, user);
        vesselItemHoursMapper.mapDetails(request, entity, vesselItems);

        entity.getItems().forEach(detail -> {
            VesselItem item = detail.getVesselItem();
            if (item.getAccumulatedHours() == null) {
                item.setAccumulatedHours(BigDecimal.valueOf(detail.getAssignedHours()));
            } else {
                item.setAccumulatedHours(item.getAccumulatedHours().add(BigDecimal.valueOf(detail.getAssignedHours())));
            }
        });

        return vesselItemHoursMapper.toDto(vesselItemHoursRepository.save(entity));
    }

    @Transactional
    @Override
    public VesselItemHoursRes update(Long id, VesselItemHoursUpdateReq request) {
        User user = authService.getAuthenticatedUser()
                .orElseThrow(()-> new ResourceNotFoundException("Usuario no encontrado"));

        VesselItemHours existing = vesselItemHoursRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Componente de Embarcación no encontrado con ID: " + id));
        existing.setDescription(request.comments());
        Vessel vessel = existing.getVessel();
        List<VesselItem> vesselItems = vesselItemRepository.findByVesselId(vessel.getId());

        existing.getItems().forEach(detail -> {
            VesselItem item = detail.getVesselItem();
            if (item.getAccumulatedHours() != null) {
                item.setAccumulatedHours(item.getAccumulatedHours()
                        .subtract(BigDecimal.valueOf(detail.getAssignedHours())));
            }
        });

        vesselItemHoursMapper.updateEntity(request, existing, vesselItems);

        existing.getItems().forEach(detail -> {
            VesselItem item = detail.getVesselItem();
            if (item.getAccumulatedHours() == null) {
                item.setAccumulatedHours(BigDecimal.valueOf(detail.getAssignedHours()));
            } else {
                item.setAccumulatedHours(item.getAccumulatedHours()
                        .add(BigDecimal.valueOf(detail.getAssignedHours())));
            }
        });

        return vesselItemHoursMapper.toDto(existing);
    }
}
