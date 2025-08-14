package com.Incamar.IncaCore.dtos.users;

import com.Incamar.IncaCore.enums.AccountStatus;
import com.Incamar.IncaCore.enums.Role;

public record UpdateUserReq(
        String email,
        Role role,
        AccountStatus accountStatus
) {
}
