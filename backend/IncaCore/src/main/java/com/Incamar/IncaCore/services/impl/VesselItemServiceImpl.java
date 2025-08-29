package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.vesselItem.VesselItemReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemRes;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemSearchReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemUpdateReq;
import com.Incamar.IncaCore.enums.MaintenanceOrderStatus;
import com.Incamar.IncaCore.enums.MaterialType;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.VesselItemMapper;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.models.Vessel;
import com.Incamar.IncaCore.models.VesselItem;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.repositories.VesselItemRepository;
import com.Incamar.IncaCore.repositories.VesselRepository;
import com.Incamar.IncaCore.services.EmailService;
import com.Incamar.IncaCore.services.VesselItemService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class VesselItemServiceImpl implements VesselItemService {

    private final VesselItemRepository vesselItemRepository;
    private final VesselItemMapper vesselItemMapper;
    private final VesselRepository vesselRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Override
    public Page<VesselItemRes> getAllWithSearch(VesselItemSearchReq request, Pageable pageable) {
        Page<VesselItem> vasselItem = vesselItemRepository.findByVesselIdOrVesselName(request.vesselId(), request.vesselName(), pageable);
        return vesselItemMapper.toVesselItemRes(vasselItem);
    }

    @Override
    public VesselItemRes getById(Long id){
        VesselItem vesselItem = vesselItemRepository.findById(id).
                orElseThrow(()-> new ResourceNotFoundException("Componente de Embarcación no encontrado con ID: " + id));
        return vesselItemMapper.toVesselItemRes(vesselItem);
    }

    @Override
    public VesselItemRes create(VesselItemReq request) {

        VesselItem vesselItem = vesselItemMapper.toVesselItem(request);

        Vessel vessel = vesselRepository.findById(request.vesselId())
                .orElseThrow(()-> new ResourceNotFoundException("Embarcación no encontrada con ID: " + request.vesselId()));
        vesselItem.setVessel(vessel);

        return vesselItemMapper.toVesselItemRes(vesselItemRepository.save(vesselItem));
    }

    @Override
    public VesselItemRes update(Long id, VesselItemUpdateReq request){
        VesselItem vesselItem = vesselItemRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Componente de Embarcación no encontrado con ID: " + id));
        vesselItemMapper.update(request, vesselItem);
        return vesselItemMapper.toVesselItemRes(vesselItemRepository.save(vesselItem));
    }

    @Override
    public void delete(Long id) {
        VesselItem vesselItem=vesselItemRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Componente de Embarcación no encontrado con ID: " + id));
        vesselItemRepository.delete(vesselItem);
    }

    @Override
    public List<VesselItemRes> findItemsRequiringMaintenanceWithoutActiveOrders() {
        List<VesselItem> vesselItems = vesselItemRepository.findItemsRequiringMaintenanceWithoutActiveOrders(
                List.of(
                        MaintenanceOrderStatus.SOLICITADO,
                        MaintenanceOrderStatus.EN_PROCESO,
                        MaintenanceOrderStatus.ESPERANDO_INSUMOS
                )
        );
        return vesselItemMapper.toVesselItemResList(vesselItems);
    }

    public void vesselItemsAlert(String email){
        List<VesselItem> items = vesselItemRepository.findItemsRequiringMaintenanceWithoutActiveOrders(
                List.of(
                        MaintenanceOrderStatus.SOLICITADO,
                        MaintenanceOrderStatus.EN_PROCESO,
                        MaintenanceOrderStatus.ESPERANDO_INSUMOS
                )
        );

        Map<Vessel, List<VesselItem>> groupedByVessel = items.stream()
                .collect(Collectors.groupingBy(VesselItem::getVessel));

        List<VesselData> vesselDataList = groupedByVessel.entrySet().stream()
                .map(entry -> {
                    List<ItemData> itemDataList = entry.getValue().stream()
                            .map(item -> new ItemData(
                                    item.getId(),
                                    item.getName(),
                                    item.getAccumulatedHours(),
                                    item.getUsefulLifeHours(),
                                    item.getAlertHours()
                            ))
                            .toList();

                    return new VesselData(entry.getKey().getName(), itemDataList);
                })
                .toList();

        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Usuario con email "+email+" no encontrado"));
        sendEmail(user,vesselDataList);
    }

    private record ItemData(Long id, String componente, BigDecimal horasAcumuladas, int intervaloMantenimiento, int umbralMantenimiento) {}
    private record VesselData(String vesselName, List<ItemData> items) {}

    private void sendEmail(User user, List<VesselData> vesselDataList ){
        Map<String, Object> templateModel = Map.of(
                "nombreResponsable", user.getEmployee().getFirstName() + " " + user.getEmployee().getLastName(),
                "vessels", vesselDataList
        );

        emailService.sendHtmlEmail(
                user.getEmail(),
                "Notificación de Mantenimiento Preventivo",
                "component-maintenance-alert",
                templateModel
        );
    }
}
