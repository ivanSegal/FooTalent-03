package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.travel.TravelRequestDto;
import com.Incamar.IncaCore.dtos.travel.TravelResponseDto;
import com.Incamar.IncaCore.models.ServiceTicketDetail;
import com.Incamar.IncaCore.models.Travel;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface TravelMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "serviceTicketDetail", source = "detail")
    Travel toEntity(TravelRequestDto dto, ServiceTicketDetail detail);

    @Mapping(target = "serviceTicketDetailId", source = "serviceTicketDetail.id")
    TravelResponseDto toDto(Travel entity);
}
