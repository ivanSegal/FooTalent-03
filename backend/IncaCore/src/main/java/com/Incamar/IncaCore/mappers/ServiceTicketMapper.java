package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketResponseDto;
import com.Incamar.IncaCore.models.ServiceTicket;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.models.Vessel;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ServiceTicketMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vessel", source = "vessel")
    @Mapping(target = "responsible", source = "responsible")
    @Mapping(target = "detail", ignore = true)
    @Mapping(target = "status", source = "dto.status")
    ServiceTicket toEntity(ServiceTicketRequestDto dto,
                           Vessel vessel,
                           User responsible);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vessel", ignore = true)
    @Mapping(target = "responsible", ignore = true)
    @Mapping(target = "detail", ignore = true)
    void updateFromDto(ServiceTicketRequestDto dto, @MappingTarget ServiceTicket target);

    @Mapping(target = "vesselName", source = "vessel.name")
    @Mapping(target = "responsibleUsername",
            expression = "java(entity.getResponsible().getEmployee().getFirstName() +" +
                    " \" \" + entity.getResponsible().getEmployee().getLastName())")
    @Mapping(target = "detailId", source = "detail.id")
    @Mapping(target = "status", source = "status")
    ServiceTicketResponseDto toDTO(ServiceTicket entity);

}
