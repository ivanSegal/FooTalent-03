package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.users.UserResponseDto;
import com.Incamar.IncaCore.models.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

  public UserResponseDto toDTO(User user) {
    UserResponseDto dto = new UserResponseDto();
    dto.setUuid(user.getId());
    dto.setUsername(user.getUsername());
    dto.setRole(user.getRole().getDescription());
    return dto;
  }
}
