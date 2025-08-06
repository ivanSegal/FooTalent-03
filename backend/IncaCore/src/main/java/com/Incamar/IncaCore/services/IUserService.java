package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.dtos.users.UserRequestDto;
import com.Incamar.IncaCore.dtos.users.UserResponseDto;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.models.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface IUserService {
    List<UserResponseDto> getAllUsers();
    UserResponseDto getUser(JwtDataDto jwtDataDto, UUID id);
    void createUser(String username, String password, Role role, LocalDateTime createdAt);
    void deleteUserById(UUID id);
    User editUser(UUID id, UserRequestDto request);
}
