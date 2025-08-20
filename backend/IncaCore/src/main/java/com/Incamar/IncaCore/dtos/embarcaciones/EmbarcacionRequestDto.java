package com.Incamar.IncaCore.dtos.embarcaciones;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Schema(
        name = "Embarcacion.EmbarcacionRequest",
        description = "Datos requeridos para el registro de una embarcación"
)
public class UserRequestDto {
    @NotBlank(message = "El nombre de la embarcación no puede estar vacío")
    @Size(min = 4, max = 20, message = "El nombre de la embarcación debe tener entre 4 y 20 caracteres")
    @Pattern(
            regexp = "^[A-Za-zÑñÁáÉéÍíÓóÚú0-9\\s'-]+$",
            message = "El nombre de usuario solo puede contener letras, números, guiones(-) y espacios"
    )
    @Schema(
            description = "Nombre de usuario único. Solo acepta letras, números, espacios y guiones",
            example = "Santa María",
            minLength = 4,
            maxLength = 20,
            pattern = "^[A-Za-zÑñÁáÉéÍíÓóÚú0-9\\s'-]+$"
    )
    private String name;
    @Pattern(
            regexp = "^[A-Z]{4}-[A-Z]{2}-\\d{4}$",
            message =
                    "El número de matrícula debe seguie el siguiente formato: AGSP-SE-0031"
    )
    @NotBlank(message = "El número de matrícula no puede estar vacía")
    @Size(min = 8, max = 20, message = "La número de matrícula debe tener entre 8 y 20 caracteres")
    @Schema(
            description =
                    "El número de matrícula debe seguie el siguiente formato: AGSP-SE-0031",
            example = "AGSP-SE-0031",
            minLength = 8,
            maxLength = 20,
            pattern = "^[A-Z]{4}-[A-Z]{2}-\\d{4}$"
    )
    private String vessel_registration_number;
    @Size(min = 4, max = 30, message = "La número de matrícula debe tener entre 8 y 20 caracteres")
    @Schema(
            description =
                    "Modelo de la embarcación",
            example = "Stellar 1",
            minLength = 4,
            maxLength = 30
    )
    private model;
    @Pattern(
            regexp = "^\\d+$",
            message =
                    "El número de matrícula debe contener dígitos"
    )
    @NotBlank(message = "El numero o código ISSM no puede estar vacío")
    @Size(min = 8, max = 12, message = "La número o código ISSM de la embarcación")
    @Schema(
            description = "Numero ISSM de la embarcación",
            example = "98821239",
            minLength = 4,
            maxLength = 30
    )
    private issm;
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$",
            message =
                    "La bandera debe contener solo letras"
    )
    @NotBlank(message = "La bandera no puede estar vacía")
    @Size(min = 4, max = 50, message = "La bandera debe contener mas de 4 caracteres")
    @Schema(
            description = "Numero ISSM de la embarcación",
            example = "Venezuela",
            minLength = 4,
            maxLength = 50,
            pattern = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$"
    )
    private flag;
    @Pattern(
            regexp = "[A-Za-z]{2,3}-\\d+\\.\\d+",
            message =
                    "El distintivo puede contener letras, numeros . y -"
    )
    @NotBlank(message = "El distintivo no puede estar vacío")
    @Size(min = 4, max = 20, message = "El distintivo debe contener entre 4 y 20 caracteres")
    @Schema(
            description = "Distintivo de la embarcación",
            example = "YYV-3.742",
            minLength = 4,
            maxLength = 20,
            pattern = "[A-Za-z]{2,3}-\\d+\\.\\d+"
    )
    private distinctive;
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$",
            message =
                    "La bandera debe contener solo letras"
    )
    @NotBlank(message = "El puerto de registro no puede estar vacía")
    @Size(min = 4, max = 50, message = "El puerto de registro debe contener mas de 4 letras")
    @Schema(
            description = "Puerto de registro de la embarcación",
            example = "PUERTO LA CRUZ",
            minLength = 4,
            maxLength = 50,
            pattern = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$"
    )
    private registrationPort;
    @Pattern(
            regexp = "^[JVG]-\\d{9}$",
            message =
                    "El RIF debe seguir el formato J-404603431"
    )
    @NotBlank(message = "El rif no puede estar vacía")
    @Schema(
            description = "RIF de la embarcación",
            example = "J-404603431",
            pattern = "^[JVG]-\\d{9}$"
    )
    private rif;
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$",
            message =
                    "El uso de la embarcación debe contener letras"
    )
    @NotBlank(message = "El uso de la embarcación es necesario")
    @Schema(
            description = "Uso de la embarcación",
            example = "Transporte",
            pattern = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$"
    )
    private use;
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$",
            message =
                    "El material de construcción de la embarcación debe contener letras"
    )
    @NotBlank(message = "El material de construcción de la embarcación es necesario")
    @Schema(
            description = "Material de construcción",
            example = "Metal",
            pattern = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$"
    )
    private hullMaterial;
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$",
            message =
                    "La popa de la embarcación debe contener letras"
    )
    @NotBlank(message = "La popa de la embarcación es necesario")
    @Schema(
            description = "Popa de la embarcación",
            example = "Cuadrada",
            pattern = "^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$"
    )
    private stern;
    @NotBlank(message = "El tipo de combustible de la embarcación es necesario")
    @Schema(
            description = "Tipo de combustible de la embarcación",
            example = "Gasolina",
    )
    private fuelType;
}
