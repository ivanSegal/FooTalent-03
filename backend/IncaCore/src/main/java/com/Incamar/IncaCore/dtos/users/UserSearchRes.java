package com.Incamar.IncaCore.dtos.user;


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


