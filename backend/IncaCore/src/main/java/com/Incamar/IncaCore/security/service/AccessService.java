package com.Incamar.IncaCore.security.service;

import com.Incamar.IncaCore.enums.Department;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("AccessService")
public class AccessService {

    public boolean hasDepartment(Authentication authentication, Role role, Department department) {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        return user.getRole().equals(role) && user.getDepartment().equals(department);
    }
}