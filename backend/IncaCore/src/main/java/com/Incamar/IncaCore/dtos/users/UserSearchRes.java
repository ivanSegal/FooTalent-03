package com.Incamar.IncaCore.dtos.users;


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


