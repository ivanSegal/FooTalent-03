package com.Incamar.IncaCore.dtos.serviceTicketDetail;

import com.Incamar.IncaCore.models.ServiceTicket;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
public class ServiceTicketDetailResponseDto {

    @Schema(example = "32")
    private Long id;

    @Schema(description = "Identificación de la embarcación asociada a la boleta de servicio.", example = "42")
    private Long serviceTicketId;

    @Schema(description = "Zona donde se realiza el servicio.", example = "Bahía de Pozuelos")
    private String serviceArea;

    @Schema(description = "¿Qué tipo de trabajo se realizó? ", example = "Transporte de documentos")
    private String serviceType;

    @Schema(description = "Descripción del trabajo realizado.",
            example = "Servicio de traslado de documentos. ")
    private String description;

    @Schema(description = "Cantidad de horas viajadas.", example = "12")
    private Integer hoursTraveled;

    @Schema(description = "Nombre completo del patrón.", example = "Silvio Rodriguez")
    private String patronFullName;

    @Schema(description = "Nombre completo del marino.", example = "Mario Sosa")
    private String marinerFullName;

    @Schema(description = "Nombre completo del Capitán.", example = "Juan Pérez")
    private String captainFullName;
}
