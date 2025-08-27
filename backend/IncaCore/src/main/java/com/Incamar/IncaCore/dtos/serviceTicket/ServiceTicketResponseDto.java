package com.Incamar.IncaCore.dtos.serviceTicket;

import com.Incamar.IncaCore.dtos.serviceTicketDetail.ServiceTicketDetailResponseDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;


@Data
public class ServiceTicketResponseDto {

    private Long id;
    private Long travelNro;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate travelDate;

    private String vesselAttended;
    private String solicitedBy;
    private String reportTravelNro;
    private String code;
    private Long checkingNro;
    private boolean status;

    private String vesselName;
    private String responsibleUsername;
    private Long detailId;

}
