package com.Incamar.IncaCore.validation;

import com.Incamar.IncaCore.dtos.auth.RegisterReq;
import com.Incamar.IncaCore.enums.Role;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class DepartmentRequiredForRoleValidator implements ConstraintValidator<DepartmentRequiredForRole, RegisterReq> {

    @Override
    public boolean isValid(RegisterReq req, ConstraintValidatorContext context) {
        if (req.role() != Role.ADMIN && req.department() == null) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("El departamento es obligatorio para el rol asignado")
                    .addPropertyNode("department")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
