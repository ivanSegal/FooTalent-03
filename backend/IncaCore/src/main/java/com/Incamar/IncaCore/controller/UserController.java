package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.dtos.user.UpdateUserReq;
import com.Incamar.IncaCore.dtos.user.UserSearchReq;

import com.Incamar.IncaCore.dtos.user.UserSearchRes;
import com.Incamar.IncaCore.services.UserService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "02 - Usuarios",
        description = "Endpoints para la gestión de usuarios ")
public class UserController {

    private final UserService userService;

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<?> searchUsers(@ParameterObject @Valid UserSearchReq params, @ParameterObject Pageable pageable) {
        Page<UserSearchRes> response = userService.searchUsers(params, pageable);
        return ResponseEntity.ok()
                .body(ApiResult.success(response,"Operación exitosa"));
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id){
        UserSearchRes response = userService.findById(id);
        return ResponseEntity.ok().body(ApiResult.success(response,"Usuario encontrado"));
    }

    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@PathVariable UUID id, @RequestBody @Valid UpdateUserReq request){
        userService.updateById(id, request);
        return ResponseEntity.ok().body(ApiResult.success("Actualizacion eixosa"));
    }





}
