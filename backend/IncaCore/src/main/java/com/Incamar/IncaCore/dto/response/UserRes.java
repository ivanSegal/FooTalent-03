package com.Incamar.IncaCore.dto.response;

import com.Incamar.IncaCore.enums.Role;

import java.util.UUID;

public record UserRes(
        UUID id,
        String username,
        Role role
) {
}
