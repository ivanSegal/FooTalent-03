package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursReq;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursRes;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursUpdateReq;
import com.Incamar.IncaCore.models.VesselItem;
import com.Incamar.IncaCore.models.VesselItemHours;
import com.Incamar.IncaCore.models.VesselItemHoursDetails;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.models.Vessel;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface VesselItemHoursMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vessel", source = "vessel")
    @Mapping(target = "responsable", source = "user")
    @Mapping(target = "items", ignore = true)
    VesselItemHours toEntity(VesselItemHoursReq dto, Vessel vessel, User user);

    @AfterMapping
    default void mapDetails(VesselItemHoursReq dto, @MappingTarget VesselItemHours entity, @Context List<VesselItem> vesselItems) {
        List<VesselItemHoursDetails> details = dto.items().stream().map(d -> {
            VesselItemHoursDetails detail = new VesselItemHoursDetails();
            detail.setVesselItemHours(entity);
            detail.setAssignedHours(d.addedHours().intValue());

            // 🔹 Validamos si el item pertenece al vessel
            VesselItem vesselItem = vesselItems.stream()
                    .filter(vi -> vi.getId().equals(d.vesselItemId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            "El item con id " + d.vesselItemId() +
                                    " no pertenece a la embarcacion seleccionada con id " + entity.getVessel().getId()
                    ));

            detail.setVesselItem(vesselItem);
            return detail;
        }).collect(Collectors.toList());

        entity.setItems(details);
    }


    @Mapping(target = "responsable", expression = "java(entity.getResponsable().getEmployee().getFirstName() + \" \" + entity.getResponsable().getEmployee().getLastName())")
    @Mapping(target = "vesselId", source = "vessel.id")
    @Mapping(target = "items", expression = "java(entity.getItems().stream().map(this::mapItem).collect(java.util.stream.Collectors.toList()))")
    VesselItemHoursRes toDto(VesselItemHours entity);

    default Page<VesselItemHoursRes> toDto(Page<VesselItemHours> vesselItems) {
        return vesselItems.map(this::toDto);
    }

    @AfterMapping
    default void mapItems(VesselItemHours entity, @MappingTarget @SuppressWarnings("unused") VesselItemHoursRes dto) {
        List<VesselItemHoursRes.Items> details = entity.getItems().stream()
                .map(this::mapItem)
                .collect(Collectors.toList());

        dto = new VesselItemHoursRes(
                entity.getId(),
                entity.getResponsable().getEmail(),
                entity.getVessel().getId(),
                entity.getDate(),
                details
        );
    }

    default VesselItemHoursRes.Items mapItem(VesselItemHoursDetails entity) {
        return new VesselItemHoursRes.Items(
                entity.getVesselItem().getId(),
                entity.getAssignedHours().doubleValue()
        );
    }



    // Solo mapeamos la fecha, los items los llenamos en @AfterMapping
    @Mapping(target = "items", ignore = true)
    void updateEntity(VesselItemHoursUpdateReq dto,
                      @MappingTarget VesselItemHours entity,
                      @Context List<VesselItem> vesselItems);

    @AfterMapping
    default void mapItems(VesselItemHoursUpdateReq dto,
                          @MappingTarget VesselItemHours entity,
                          @Context List<VesselItem> vesselItems) {

        List<VesselItemHoursDetails> details = dto.items().stream().map(d -> {
            VesselItem item = vesselItems.stream()
                    .filter(vi -> vi.getId().equals(d.vesselItemId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El item con id " + d.vesselItemId() +
                                    " no pertenece a la embarcación seleccionada"
                    ));

            VesselItemHoursDetails detail = new VesselItemHoursDetails();
            detail.setVesselItemHours(entity);
            detail.setVesselItem(item);
            detail.setAssignedHours(d.addedHours().intValue());

            return detail;
        }).collect(Collectors.toList());

        entity.getItems().clear();
        entity.getItems().addAll(details);
    }
}
