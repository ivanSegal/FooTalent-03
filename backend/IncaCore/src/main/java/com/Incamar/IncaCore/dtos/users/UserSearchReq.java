package com.Incamar.IncaCore.dtos.user;

import com.Incamar.IncaCore.enums.AccountStatus;
import com.Incamar.IncaCore.enums.Role;

public record UserSearchReq(
        String name,
        String username,
        String email,
        Role role,
        AccountStatus accountStatus
) {
}
