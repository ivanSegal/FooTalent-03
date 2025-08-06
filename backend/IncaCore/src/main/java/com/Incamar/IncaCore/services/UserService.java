package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.dtos.users.UserRequestDto;
import com.Incamar.IncaCore.dtos.users.UserResponseDto;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.exceptions.ConflictException;
import com.Incamar.IncaCore.exceptions.ForbiddenException;
import com.Incamar.IncaCore.exceptions.ResourceNotFoundException;
import com.Incamar.IncaCore.mappers.UserMapper;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService, IUserService {
  private final UserRepository userRepository;
  private final UserMapper userMapper;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository.findByUsername(username)
        .orElseThrow(() ->
            new UsernameNotFoundException("Usuario no encontrado con email: " + username));
  }

  @Override
  public Page<UserResponseDto> getAllUsers(Pageable pageable) {
    Page<User> userPage = userRepository.findAll(pageable);
    return userPage.map(userMapper::toDTO);
  }

  @Override
  public UserResponseDto getUser(JwtDataDto jwtDataDto, UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    if (!jwtDataDto.getRole().equals("ADMIN") && !user.getId().equals(jwtDataDto.getUuid()) ) {
      throw new ForbiddenException("No puedes acceder a otro usuario.");
    }
    return userMapper.toDTO(user);
  }

  @Override
  public void createUser(String username, String password, Role role, LocalDateTime createdAt){
    if (userRepository.existsByUsername(username)) {
      throw new ConflictException("El nombre de usuario ya está en uso");
    }
    User newUser = new User();

    newUser.setUsername(username);
    newUser.setPassword(password);
    newUser.setRole(role);
    newUser.setCreatedAt(createdAt);

    userRepository.save(newUser);
  }

  @Override
  public void deleteUserById(UUID id) {
    if(!userRepository.existsById(id)){
      throw new ResourceNotFoundException("No se encontró usuario con ID: " + id);
    }
    userRepository.deleteById(id);
  }

  @Override
  public User editUser(UUID id, UserRequestDto request) {
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new ConflictException("El nombre de usuario ya está en uso");
    }
    User auxUser = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

    auxUser.setUsername(request.getUsername());
    auxUser.setPassword(request.getPassword());
    auxUser.setRole(Role.valueOf(request.getRole()));
    auxUser.setCreatedAt(request.getCreatedAt());

    return userRepository.save(auxUser);
  }

  @Override
  public Page<UserResponseDto> searchUsersByUsername(String username, Pageable pageable) {
    return userRepository
            .findByUsernameContainingIgnoreCase(username, pageable)
            .map(userMapper::toDTO);
  }
}
