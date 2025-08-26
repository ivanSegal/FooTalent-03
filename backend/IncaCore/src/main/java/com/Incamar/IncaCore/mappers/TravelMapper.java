package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.travel.TravelRequestDto;
import com.Incamar.IncaCore.dtos.travel.TravelResponseDto;
import com.Incamar.IncaCore.models.ServiceTicketDetail;
import com.Incamar.IncaCore.models.Travel;
import org.mapstruct.*;

import java.time.Duration;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface TravelMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "serviceTicketDetail", source = "detail")
    Travel toEntity(TravelRequestDto dto, ServiceTicketDetail detail);

    @Mapping(target = "serviceTicketDetailId", source = "serviceTicketDetail.id")
    @Mapping(target = "totalTraveledTime", ignore = true )
    TravelResponseDto toDto(Travel entity);

    @AfterMapping
    default void setTotalTraveledTime(Travel entity, @MappingTarget TravelResponseDto dto) {
        if (entity.getDepartureTime() != null && entity.getArrivalTime() != null) {
            Duration duration = Duration.between(entity.getDepartureTime(), entity.getArrivalTime());

            if (duration.isNegative()) {
                duration = duration.plusHours(24);
            }

            long hours = duration.toHours();
            long minutes = duration.toMinutesPart();

            String formatted = String.format("%02d:%02d", hours, minutes);
            dto.setTotalTraveledTime(formatted);
        }
    }
}
