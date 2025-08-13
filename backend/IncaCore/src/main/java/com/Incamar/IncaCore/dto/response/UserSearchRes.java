package com.Incamar.IncaCore.dto.response;


import java.util.UUID;

public record UserSearchRes(
        UUID id,
        String fullName,
        String username,
        String email,
        String role,
        String accountStatus
) {
}


