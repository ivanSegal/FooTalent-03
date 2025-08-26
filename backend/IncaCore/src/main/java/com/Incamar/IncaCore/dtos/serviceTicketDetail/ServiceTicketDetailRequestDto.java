package com.Incamar.IncaCore.dtos.serviceTicketDetail;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ServiceTicketDetailRequestDto {

    @Schema(description = "ID del ServiceTicket padre.", example = "42")
    @NotNull(groups = {Create.class,Update.class})
    private Long serviceTicketId;

    @Schema(description = "Área de servicio (p.ej. Bahía de Pozuelos).",
            example = "Bahía de Pozuelos")
    @NotNull(groups = {Create.class})
    @Size(max = 50)
    private String serviceArea;

    @Schema(description = "Tipo de servicio (p.ej. Traslado de materiales).",
            example = "Traslado de materiales")
    @NotNull(groups = {Create.class})
    @Size(max = 50)
    private String serviceType;

    @Schema(description = "Descripción del trabajo realizado",
            example = "Servicio de traslado de materiales prestado a [nombre compañia]. ")
    @Size(max = 1000)
    @NotNull(groups = {Create.class})
    private String description;

    /*@Schema(description = "Horas navegadas o trabajadas vinculadas al servicio.",
            example = "06:30")
    @NotNull(groups = {Create.class})
    @PositiveOrZero
    private String hoursTraveled;*/

    @Schema(description = "Nombre completo del patrón de barco.", example = "Juan Pérez")
    @NotNull(groups = {Create.class})
    @Pattern(regexp = "^[a-zA-Z\\\\s]+$")
    @Size(max=50)
    private String patronFullName;

    @Schema(description = "Nombre completo del marino.", example = "Juan Pérez")
    @NotNull(groups = {Create.class})
    @Pattern(regexp = "^[a-zA-Z\\\\s]+$")
    @Size(max=50)
    private String marinerFullName;

    @Schema(description = "Nombre completo del Capitán.", example = "Juan Pérez")
    @NotNull(groups = {Create.class})
    @Pattern(regexp = "^[a-zA-Z\\\\s]+$")
    @Size(max=50)
    private String captainFullName;


    public interface Create {}
    public interface Update {}
}
