package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.serviceTicket.ServiceTicketRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailRequestDto;
import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailResponseDto;
import com.Incamar.IncaCore.models.ServiceTicket;
import com.Incamar.IncaCore.models.ServiceTicketDetail;
import com.Incamar.IncaCore.services.TravelService;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ServiceTicketDetailMapper {

    @Mapping(target = "id" , ignore = true)
    @Mapping(target = "serviceTicket", source = "serviceTicket")
    ServiceTicketDetail toEntity(ServiceTicketDetailRequestDto requestDto,
                                 ServiceTicket serviceTicket);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "serviceTicket", ignore = true)
    @Mapping(target = "id", ignore=true)
    void updateDetailsFromDto(ServiceTicketDetailRequestDto requestDto, @MappingTarget ServiceTicketDetail target);

    @Mapping(target = "serviceTicketId", source = "serviceTicket.id")
    @Mapping(target = "hoursTraveled", ignore = true)
    ServiceTicketDetailResponseDto toDto(ServiceTicketDetail entity);
}
