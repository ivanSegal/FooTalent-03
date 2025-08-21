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
    @Mapping(target = "boat", source = "boat")
    @Mapping(target = "responsible", source = "responsible")
    ServiceTicket toEntity(ServiceTicketRequestDto dto,
                           Vessel boat,
                           User responsible);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "boat", ignore = true)
    @Mapping(target = "responsible", ignore = true)
    void updateFromDto(ServiceTicketRequestDto dto, @MappingTarget ServiceTicket target);

    @Mapping(target = "boatName", source = "boat.name")
    @Mapping(target = "responsibleUsername", source = "responsible.employee.firstName")
    ServiceTicketResponseDto toDTO(ServiceTicket entity);
/*
    // Regex para AAA-00-0 .. AAAA-00-0000 y capturar el bloque final
    private static final Pattern REPORT_TRAVEL_PATTERN =
            Pattern.compile("[A-Z]{3,4}-\\d{2}-(\\d{1,4})");


    public ServiceTicket toEntity(ServiceTicketRequestDto dto, User responsable, Embarcacion embarcacion) {
        ServiceTicket e = new ServiceTicket();
        e.setEmbarcacion(embarcacion);
        e.setResponsable(responsable);

        e.setTravelDate(dto.getTravelDate());
        e.setTravelNro(dto.getTravelNro());              // <-- FALTABA
        e.setVesselAttended(dto.getVesselAttended());
        e.setSolicitedBy(dto.getSolicitedBy());
        e.setReportTravelNro(dto.getReportTravelNro());
        e.setCode(dto.getCode());
        e.setCheckingNro(dto.getCheckingNro());

        return e;
    }


    public void updateEntityFromDto(ServiceTicketRequestDto dto, ServiceTicket target) {
        if (dto.getTravelDate() != null)       target.setTravelDate(dto.getTravelDate());
        if (dto.getTravelNro() != null)        target.setTravelNro(dto.getTravelNro());
        if (dto.getVesselAttended() != null)   target.setVesselAttended(dto.getVesselAttended());
        if (dto.getSolicitedBy() != null)      target.setSolicitedBy(dto.getSolicitedBy());
        if (dto.getReportTravelNro() != null)  target.setReportTravelNro(dto.getReportTravelNro());
        if (dto.getCode() != null)             target.setCode(dto.getCode());
        if (dto.getCheckingNro() != null)      target.setCheckingNro(dto.getCheckingNro());
        // Embarcación la cambiás desde el service (necesitás repo para resolver el id)
    }


    public ServiceTicketResponseDto toDTO(ServiceTicket e) {
        ServiceTicketResponseDto dto = new ServiceTicketResponseDto();
        dto.setId(e.getId());
        dto.setTravelNro(e.getTravelNro());
        dto.setTravelDate(e.getTravelDate());
        dto.setVesselAttended(e.getVesselAttended());
        dto.setSolicitedBy(e.getSolicitedBy());
        dto.setReportTravelNro(e.getReportTravelNro());
        dto.setCode(e.getCode());
        dto.setCheckingNro(e.getCheckingNro());

        // null-safe y evita NPEs si la relación no está inicializada
        dto.setNombreEmbarcacion(e.getEmbarcacion() != null ? e.getEmbarcacion().getNombre() : null);
        dto.setResponsableUsername(e.getResponsable() != null ? e.getResponsable().getUsername() : null);

        return dto;
    }


    public void validateTravelConsistency(Long travelNro, String reportTravelNro) {
        if (travelNro == null || reportTravelNro == null) return;
        Matcher m = REPORT_TRAVEL_PATTERN.matcher(reportTravelNro);
        if (!m.matches()) return; // el @Pattern de Bean Validation ya hará su trabajo
        long lastBlock = Long.parseLong(m.group(1)); // "0123" -> 123
        if (!Objects.equals(lastBlock, travelNro)) {
            throw new IllegalArgumentException("travelNro debe coincidir con los últimos dígitos de reportTravelNro");
        }
    }
    */
/*
    public ServiceTicket toEntity(ServiceTicketRequestDto boletaServicioRequestDto, User responsable, Embarcacion embarcacion){

        ServiceTicket boleta = new ServiceTicket();

        boleta.setEmbarcacion(embarcacion);
        boleta.setResponsable(responsable);
        boleta.setSolicitedBy(boletaServicioRequestDto.getSolicitedBy());
        boleta.setTravelDate(boletaServicioRequestDto.getTravelDate());
        boleta.setCheckingNro(boletaServicioRequestDto.getCheckingNro());
        boleta.setCode(boletaServicioRequestDto.getCode());
        boleta.setReportTravelNro(boletaServicioRequestDto.getReportTravelNro());
        boleta.setVesselAttended(boletaServicioRequestDto.getVesselAttended());

        return boleta;

    }

    public ServiceTicketResponseDto toDTO (ServiceTicket boletaServicio){

        ServiceTicketResponseDto boletaDto = new ServiceTicketResponseDto();

        boletaDto.setId(boletaServicio.getId());
        boletaDto.setTravelNro(boletaServicio.getTravelNro());
        boletaDto.setCode(boletaServicio.getCode());
        boletaDto.setTravelDate(boletaServicio.getTravelDate());
        boletaDto.setCheckingNro(boletaServicio.getCheckingNro());
        boletaDto.setSolicitedBy(boletaServicio.getSolicitedBy());
        boletaDto.setReportTravelNro(boletaServicio.getReportTravelNro());
        boletaDto.setNombreEmbarcacion(boletaServicio.getEmbarcacion().getNombre());
        boletaDto.setResponsableUsername(boletaServicio.getResponsable().getUsername());


        return boletaDto;
    }

 */
}
