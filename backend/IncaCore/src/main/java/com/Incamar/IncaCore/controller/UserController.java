package com.Incamar.IncaCore.controller;

import com.Incamar.IncaCore.dto.request.UserSearchReq;

import com.Incamar.IncaCore.dto.response.UserSearchRes;
import com.Incamar.IncaCore.service.UserService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(){
        return null;
    }




}
