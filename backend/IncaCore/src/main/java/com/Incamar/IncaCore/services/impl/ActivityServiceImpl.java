package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.activity.ActivityRequestDto;
import com.Incamar.IncaCore.dtos.activity.ActivityResponseDto;
import com.Incamar.IncaCore.enums.ActivityType;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.ActivityMapper;
import com.Incamar.IncaCore.models.Activity;
import com.Incamar.IncaCore.models.InventoryMovement;
import com.Incamar.IncaCore.models.MaintenanceOrder;
import com.Incamar.IncaCore.models.VesselItem;
import com.Incamar.IncaCore.repositories.*;
import com.Incamar.IncaCore.services.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ActivityServiceImpl implements ActivityService {
    @Autowired
    ActivityRepository activityRepository;
    @Autowired
    MaintenanceOrderRepository maintenanceOrderRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ActivityMapper mapper;
    @Autowired
    private VesselItemRepository vesselItemRepository;
    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Override
    public Page<ActivityResponseDto> getAllActivities(Pageable pageable) {
        return activityRepository.findAll(pageable)
                .map(mapper::toDTO);
    }

    @Override
    public ActivityResponseDto getActivityById(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actividad no encontrada con ID: " + id));
        return mapper.toDTO(activity);
    }

    @Override
    public ActivityResponseDto createActivity(ActivityRequestDto requestDto) {
        MaintenanceOrder maintenanceOrder = maintenanceOrderRepository.findById(requestDto.getMaintenanceOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Orden de mantenimiento no encontrada con ID: " +
                        requestDto.getMaintenanceOrderId()));
        VesselItem vesselItem = vesselItemRepository.findById(requestDto.getVesselItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Componente/Subcomponente no encontrado con ID: " +
                        requestDto.getMaintenanceOrderId()));

        InventoryMovement inventoryMovement = null;
        if (requestDto.getInventoryMovementId() != null) {
            inventoryMovement = inventoryMovementRepository.findById(requestDto.getInventoryMovementId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Movimiento de Inventario no encontrado con ID: " + requestDto.getInventoryMovementId()
                    ));
        }

        // Crear y guardar la actividad
        Activity activity = mapper.toEntity(requestDto, maintenanceOrder, vesselItem, inventoryMovement);
        Activity savedActivity = activityRepository.save(activity);

        // --- Actualizar alertHours del VesselItem ---
        if (vesselItem.getAccumulatedHours() != null &&
                vesselItem.getUsefulLifeHours() != null) {
            vesselItem.setAlertHours(
                    vesselItem.getAccumulatedHours().intValue() + vesselItem.getUsefulLifeHours()
            );
            vesselItemRepository.save(vesselItem);
        }

        return mapper.toDTO(savedActivity);
    }

    @Override
    public void deleteActivityById(Long id) {
        if (!activityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Actividad no encontrada con ID: " + id);
        }
        activityRepository.deleteById(id);
    }

    @Override
    public ActivityResponseDto editActivity(Long id, ActivityRequestDto requestDto) {
        Activity auxActivity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actividad no encontrada con ID: " + id));
        if(requestDto.getMaintenanceOrderId() != null){
            MaintenanceOrder maintenanceOrder = maintenanceOrderRepository.findById(requestDto.getMaintenanceOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Orden de mantenimiento no encontrada con ID: " +
                            requestDto.getMaintenanceOrderId()));
            auxActivity.setMaintenanceOrder(maintenanceOrder);
        }
        if(requestDto.getVesselItemId() != null){
            VesselItem vesselItem = vesselItemRepository.findById(requestDto.getVesselItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Componente/Subcomponente no encontrado con ID: " +
                            requestDto.getMaintenanceOrderId()));
            auxActivity.setVesselItem(vesselItem);
        }
        if(requestDto.getVesselItemId() != null){
            InventoryMovement inventoryMovement = inventoryMovementRepository.findById(requestDto.getInventoryMovementId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Movimiento de Inventario no encontrado con ID: " + requestDto.getInventoryMovementId()
                    ));
            auxActivity.setInventoryMovement(inventoryMovement);
        }
        if (requestDto.getActivityType() != null)          auxActivity.setActivityType(ActivityType.valueOf(requestDto.getActivityType()));
        if (requestDto.getDescription() != null)           auxActivity.setDescription(requestDto.getDescription());

        return mapper.toDTO(activityRepository.save(auxActivity));
    }

    @Override
    public Page<ActivityResponseDto> searchActivitiesByMaintenanceOrderId(Long Id, Pageable pageable) {
        return activityRepository.findByMaintenanceOrder_Id(Id, pageable).map(mapper::toDTO);
    }

    @Override
    public Page<ActivityResponseDto> searchActivitiesByVesselName(String vesselName, Pageable pageable) {
        return activityRepository.findByMaintenanceOrder_Vessel_NameContainingIgnoreCase(vesselName, pageable).map(mapper::toDTO);
    }

}
