package com.Incamar.IncaCore.dtos.users;


import java.util.UUID;

public record UserSearchRes(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String role,
        String department,
        String accountStatus
) {
}


