package com.Incamar.IncaCore.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = DepartmentRequiredForRoleValidator.class)
@Target({ ElementType.TYPE }) // se aplica a clases/records
@Retention(RetentionPolicy.RUNTIME)
public @interface DepartmentRequiredForRole {
    String message() default "El departamento es obligatorio para este rol";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

