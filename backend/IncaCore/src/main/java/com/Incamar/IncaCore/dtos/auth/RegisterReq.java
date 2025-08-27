package com.Incamar.IncaCore.dtos.auth;

import com.Incamar.IncaCore.enums.Department;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.validation.DepartmentRequiredForRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@DepartmentRequiredForRole
@Schema(name = "Auth.RegisterRequest",
        description = "Datos necesarios para registrar un nuevo usuario en el sistema.",
        requiredProperties = {"firstName", "lastName","role","email"})
public record RegisterReq(

        @Schema(description = "Nombre(s) del usuario. Permitidos letras (incluye acentos), espacios, guiones y apóstrofes.", example = "Juan José")
        @NotBlank(message = "El nombre es requerido")
        @Pattern(regexp = "^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$", message = "El nombre contiene caracteres no permitidos")
        String firstName,

        @Schema(description = "Apellido(s) del usuario. Permitidos letras (incluye acentos), espacios, guiones y apóstrofes.", example = "Pérez Gómez")
        @NotBlank(message = "El apellido es requerido")
        @Pattern(regexp = "^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$", message = "El apellido contiene caracteres no permitidos")
        String lastName,

        @Schema(description = "Correo electronico del usuario.", example = "juan.perez@example.com")
        @Email(message = "email debe tener formato valido")
        @NotBlank(message = "El email es requerido")
        String email,

        @Schema(description = "Rol del usuario. Valores permitidos: ADMIN, OPERATIONS_MANAGER, WAREHOUSE_STAFF", example = "ADMIN", allowableValues = {"ADMIN", "OPERATIONS_MANAGER", "WAREHOUSE_STAFF"})
        @NotNull(message = "role es requerido")
        Role role,

        @Schema(description = "Departamento al que pertenece el usuario, no es requerido en usuarios de rol ADMIN,", allowableValues = {"INVENTORY","MAINTENANCE","VESSEL"})
        Department department

) {}
