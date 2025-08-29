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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthService authService;


    @Override
    public Page<UserSearchRes> searchUsers(UserSearchReq params, Pageable pageable) {
        Pageable customPageable = mapSort(pageable);
         Page<User> users = userRepository.searchUsers(params.email(), params.role(),
                 params.accountStatus(), params.name(), customPageable);

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
    public UserSearchRes updateById(UUID id, @Valid UpdateUserReq request) {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException("Usuario no econtrado"));

        userMapper.updateUserFromDto(request,user);

        return userMapper.toUserSearchRes(userRepository.save(user));
    }

    @Override
    public void deleteById(UUID id) {
        userRepository.deleteById(id);
    }



    private Pageable mapSort(Pageable pageable) {
        List<Sort.Order> orders = new ArrayList<>();
        for (Sort.Order order : pageable.getSort()) {
            String property = order.getProperty();
            if (property.equals("lastName") || property.equals("firstName")) {
                property = "employee." + property;
            }
            orders.add(new Sort.Order(order.getDirection(), property));
        }
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(orders));
    }
}
