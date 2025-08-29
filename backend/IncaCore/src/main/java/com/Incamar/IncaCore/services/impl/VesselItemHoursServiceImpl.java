package com.Incamar.IncaCore.services.impl;

import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursReq;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursRes;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursUpdateReq;
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

    //Se envia notificación a las 7 de la mañana hora mexico
    @Scheduled(cron = "0 0 8 * * *", zone = "America/Mexico_City")
    public void executeDailyTask() {
        List<VesselData> vesselDataList = new ArrayList<>();

        vesselRepository.findAll().forEach(vessel -> {
            List<ItemData> itemsData = new ArrayList<>();

            vessel.getItems().forEach(item -> {
                if(item.getAccumulatedHours().compareTo(BigDecimal.valueOf(item.getAlertHours()))>=0){
                    ItemData itemData = new ItemData(
                            item.getId(),
                            item.getName(),
                            item.getAccumulatedHours(),
                            item.getUsefulLifeHours(),
                            item.getAlertHours()
                    );
                    itemsData.add(itemData);
                }
            });

            if (!itemsData.isEmpty()) {
                VesselData vesselData = new VesselData(vessel.getName(), itemsData);
                vesselDataList.add(vesselData);
            }
        });

        User user = userRepository.findByEmail("edgarcamberos18@gmail.com").orElseThrow();
        sendEmail(user,vesselDataList);

    }

    private record ItemData(Long id, String componente, BigDecimal horasAcumuladas, int intervaloMantenimiento, int umbralMantenimiento) {}
    private record VesselData(String vesselName, List<ItemData> items) {}

    public void sendEmail(User user, List<VesselData> vesselDataList ){
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
