package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderRequestDto;
import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.enums.MaintenanceType;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.MaintenanceOrderMapper;
import com.Incamar.IncaCore.models.Vessel;
import com.Incamar.IncaCore.models.MaintenanceOrder;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.VesselRepository;
import com.Incamar.IncaCore.repositories.MaintenanceOrderRepository;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.security.CustomUserDetails;
import com.Incamar.IncaCore.services.MaintenanceOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MaintenanceOrderServiceImpl implements MaintenanceOrderService {
    @Autowired
    MaintenanceOrderRepository maintenanceOrderRepository;
    @Autowired
    VesselRepository vesselRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    MaintenanceOrderMapper mapper;

    @Override
    public Page<MaintenanceOrderResponseDto> getAllMaintenanceOrders(Pageable pageable) {
        return maintenanceOrderRepository.findAll(pageable)
                .map(mapper::toDTO);
    }

    @Override
    public MaintenanceOrderResponseDto getMaintenanceOrderById(Long id) {
        MaintenanceOrder order = maintenanceOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de mantenimiento no encontrada con ID: " + id));
        return mapper.toDTO(order);
    }

    @Override
    public MaintenanceOrderResponseDto createMaintenanceOrder(MaintenanceOrderRequestDto requestDto, CustomUserDetails userDetails) {
        Vessel vessel = vesselRepository.findById(requestDto.getVesselId())
                .orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada con ID: " + requestDto.getVesselId()));

        User loggedInUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        MaintenanceOrder order = mapper.toEntity(requestDto, vessel, loggedInUser);

        return mapper.toDTO(maintenanceOrderRepository.save(order));
    }

    @Override
    public void deleteMaintenanceOrderById(Long id) {
        if (!maintenanceOrderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Orden de mantenimiento no encontrada con ID: " + id);
        }
        maintenanceOrderRepository.deleteById(id);
    }

    @Override
    public MaintenanceOrderResponseDto editMaintenanceOrder(Long id, MaintenanceOrderRequestDto dto) {
        MaintenanceOrder auxMaintenanceOrder = maintenanceOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de mantenimiento no encontrada con ID: " + id));
        if(dto.getVesselId() != null){
            Vessel vessel = vesselRepository.findById(dto.getVesselId())
                    .orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada con ID: " + dto.getVesselId()));
            auxMaintenanceOrder.setVessel(vessel);
        }

        if (dto.getStatus() != null)            auxMaintenanceOrder.setStatus(MaintenanceOrderStatus.valueOf(dto.getStatus()));
        if (dto.getMaintenanceType() != null)   auxMaintenanceOrder.setMaintenanceType(MaintenanceType.valueOf(dto.getMaintenanceType()));
        if (dto.getIssuedAt() != null)          auxMaintenanceOrder.setIssuedAt(dto.getIssuedAt());
        if (dto.getScheduledAt() != null)       auxMaintenanceOrder.setScheduledAt(dto.getScheduledAt());
        if (dto.getStartedAt() != null)         auxMaintenanceOrder.setStartedAt(dto.getStartedAt());
        if (dto.getFinishedAt() != null)        auxMaintenanceOrder.setFinishedAt(dto.getFinishedAt());
        if (dto.getMaintenanceReason() != null) auxMaintenanceOrder.setMaintenanceReason(dto.getMaintenanceReason());

        return mapper.toDTO(maintenanceOrderRepository.save(auxMaintenanceOrder));
    }

    @Override
    public Page<MaintenanceOrderResponseDto> searchMaintenanceOrderByVessel(String vesselName, Pageable pageable) {
        return maintenanceOrderRepository.findByVessel_NameContainingIgnoreCase(vesselName, pageable).map(mapper::toDTO);
    }
}
