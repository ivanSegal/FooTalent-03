package com.Incamar.IncaCore.security.service;

import com.Incamar.IncaCore.enums.Department;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("securityService")
public class SecurityService {

    /**
     * Valida si el usuario actual tiene el rol y departamento especificados
     */
    public boolean hasRoleAndDepartment(String roleName, String departmentName) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
        Role requiredRole = Role.valueOf(roleName);
        Department requiredDepartment = Department.valueOf(departmentName);

        boolean hasRole = user.getRole() == requiredRole;
        boolean hasDepartment = user.getDepartment() == requiredDepartment;

        return  hasRole && hasDepartment;
    }

}