package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.dtos.users.UserResponseDto;
import com.Incamar.IncaCore.exceptions.ForbiddenException;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.UserMapper;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {
  private final UserRepository userRepository;
  private final UserMapper userMapper;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository.findByUsername(username)
        .orElseThrow(() ->
            new UsernameNotFoundException("Usuario no encontrado con email: " + username));
  }

  public List<UserResponseDto> getAllUsers() {
    List<User> users = userRepository.findAll();
    return users.stream()
        .map(userMapper::toDTO)
        .collect(Collectors.toList());
  }

  public UserResponseDto getUser(JwtDataDto jwtDataDto, UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    if (!user.getRole().equals("ADMIN") && !user.getId().equals(jwtDataDto.getUuid()) ) {
      throw new ForbiddenException("No puedes acceder a otro usuario.");
    }
    return userMapper.toDTO(user);
  }
}
