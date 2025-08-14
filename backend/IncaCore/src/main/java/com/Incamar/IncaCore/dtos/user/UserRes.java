package com.Incamar.IncaCore.dtos.user;

import com.Incamar.IncaCore.enums.Role;

import java.util.UUID;

public record UserRes(
        UUID id,
        String username,
        Role role
) {
}
