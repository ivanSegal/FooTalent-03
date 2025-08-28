package com.Incamar.IncaCore.services.impl;


import com.Incamar.IncaCore.dtos.users.UpdateUserReq;
import com.Incamar.IncaCore.dtos.users.UserSearchReq;
import com.Incamar.IncaCore.dtos.users.UserSearchRes;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.exceptions.UserNotFoundException;
import com.Incamar.IncaCore.mappers.UserMapper;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.repositories.UserRepository;
import com.Incamar.IncaCore.services.AuthService;
import com.Incamar.IncaCore.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthService authService;


    @Override
    public Page<UserSearchRes> searchUsers(UserSearchReq params, Pageable pageable) {
         Page<User> users = userRepository.searchUsers(params.email(), params.role(),
                 params.accountStatus(), params.name(), pageable);

         return userMapper.toUserSearchRes(users);
    }

    public UserSearchRes findById(UUID id) {
        User usuarioAuth = authService.getAuthenticatedUser()
                .orElseThrow(() -> new RuntimeException("No autenticado"));

        if (!usuarioAuth.getRole().equals(Role.ADMIN) && !usuarioAuth.getId().equals(id)) {
            throw new AccessDeniedException("No tienes permiso para ver este perfil");
        }

        User usuario = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        return userMapper.toUserSearchRes(usuario);
    }

    @Override
    public void updateById(UUID id, @Valid UpdateUserReq request) {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException("Usuario no econtrado"));

        userMapper.updateUserFromDto(request,user);
        userRepository.save(user);
    }

    @Override
    public void deleteById(UUID id) {
        userRepository.deleteById(id);
    }
}
