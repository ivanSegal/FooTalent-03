package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.ordenMantenimiento.MaintenanceOrderRequestDto;
import com.Incamar.IncaCore.dtos.ordenMantenimiento.MaintenanceOrderResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.enums.MaintenanceType;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.MaintenanceOrderMapper;
import com.Incamar.IncaCore.models.Embarcacion;
import com.Incamar.IncaCore.models.MaintenanceOrder;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.EmbarcacionRepository;
import com.Incamar.IncaCore.repositories.MaintenanceOrderRepository;
import com.Incamar.IncaCore.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MaintenanceOrderService implements IMaintenanceOrderService {
    private final MaintenanceOrderRepository maintenanceOrderRepository;
    private final EmbarcacionRepository embarcacionRepository;
    private final UserRepository userRepository;
    private final MaintenanceOrderMapper mapper;

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
    public MaintenanceOrderResponseDto createMaintenanceOrder(MaintenanceOrderRequestDto dto, JwtDataDto jwtDataDto) {
        Embarcacion embarcacion = embarcacionRepository.findById(dto.getEmbarcacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada con ID: " + dto.getEmbarcacionId()));

        User loggedInUser = userRepository.findById(jwtDataDto.getUuid())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        MaintenanceOrder order = mapper.toEntity(dto, embarcacion, loggedInUser);

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
        if(dto.getEmbarcacionId() != null){
            Embarcacion embarcacion = embarcacionRepository.findById(dto.getEmbarcacionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Embarcación no encontrada con ID: " + dto.getEmbarcacionId()));
            auxMaintenanceOrder.setEmbarcacion(embarcacion);
        }

        if (dto.getEstado() != null) auxMaintenanceOrder.setMaintenanceOrderStatus(MaintenanceOrderStatus.valueOf(dto.getEstado()));
        if (dto.getTipoMantenimiento() != null) auxMaintenanceOrder.setMaintenanceType(MaintenanceType.valueOf(dto.getTipoMantenimiento()));
        if (dto.getFechaEmision() != null) auxMaintenanceOrder.setIssuedAt(dto.getFechaEmision());
        if (dto.getFechaProgramada() != null) auxMaintenanceOrder.setScheduledAt(dto.getFechaProgramada());
        if (dto.getFechaInicio() != null) auxMaintenanceOrder.setStartedAt(dto.getFechaInicio());
        if (dto.getFechaFin() != null) auxMaintenanceOrder.setFinishedAt(dto.getFechaFin());
        if (dto.getMotivoMantenimiento() != null) auxMaintenanceOrder.setMaintenanceReason(dto.getMotivoMantenimiento());

        return mapper.toDTO(maintenanceOrderRepository.save(auxMaintenanceOrder));
    }

    @Override
    public Page<MaintenanceOrderResponseDto> searchMaintenanceOrderByEmbarcacion(String nombreEmbarcacion, Pageable pageable) {
        return maintenanceOrderRepository.findByEmbarcacion_NombreContainingIgnoreCase(nombreEmbarcacion, pageable).map(mapper::toDTO);
    }
}
