package com.Incamar.IncaCore.dtos.users;

import com.Incamar.IncaCore.enums.AccountStatus;
import com.Incamar.IncaCore.enums.Department;
import com.Incamar.IncaCore.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UpdateUserReq(
        @Schema(description = "Nombre(s) del usuario. Permitidos letras (incluye acentos), espacios, guiones y apóstrofes.", example = "Juan José")
        @NotBlank(message = "El nombre es requerido")
        @Pattern(regexp = "^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$", message = "El nombre contiene caracteres no permitidos")
        String firstName,

        @Schema(description = "Apellido(s) del usuario. Permitidos letras (incluye acentos), espacios, guiones y apóstrofes.", example = "Pérez Gómez")
        @NotBlank(message = "El apellido es requerido")
        @Pattern(regexp = "^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$", message = "El apellido contiene caracteres no permitidos")
        String lastName,

        @Schema(description = "Rol del usuario. Valores permitidos: ADMIN, OPERATIONS_MANAGER, WAREHOUSE_STAFF", example = "ADMIN", allowableValues = {"ADMIN", "OPERATIONS_MANAGER", "WAREHOUSE_STAFF"})
        @NotNull(message = "El rol del usuaio es requerido")
        Role role,

        @Schema(description = "Departamento al que pertenece el usuario", example = "INVENTORY", allowableValues = {"INVENTORY", "MAINTENANCE", "VESSEL"})
        @NotNull(message = "El rol del usuaio es requerido")
        Department department,

        @Schema(description="EstadO de la cuenta del usuario", example = "ACTIVE", allowableValues = {"ACTIVE", "INACTIVE", "SUSPENDED", "ON_VACATION", "BLOCKED"})
        AccountStatus accountStatus
) {
}
