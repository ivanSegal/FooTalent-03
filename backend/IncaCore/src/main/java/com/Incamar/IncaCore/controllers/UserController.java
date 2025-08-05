package com.Incamar.IncaCore.controllers;
import com.Incamar.IncaCore.documentation.user.GetAllUsersEndpointDoc;
import com.Incamar.IncaCore.documentation.user.GetUserByIdEndpointDoc;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.dtos.users.UserResponseDto;
import com.Incamar.IncaCore.services.UserService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "02 - Usuarios",
    description = "Endpoints para la gestion de usuarios.")
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAllUsers")
    @GetAllUsersEndpointDoc
    public ResponseEntity<ApiResult<?>> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResult.success(users,
            "Se enviaron correctamente la lista de usuarios."));
    }

    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'OPERATIONS_MANAGER', 'ADMIN')")
    @GetMapping("/getUserById/{id}")
    @GetUserByIdEndpointDoc
    public ResponseEntity<ApiResult<?>> getUserById(
        @PathVariable UUID id,
        Authentication authentication
    ) {
        JwtDataDto jwtDataDto = (JwtDataDto) authentication.getPrincipal();
        UserResponseDto userResponseDto = userService.getUser(jwtDataDto, id);
        return ResponseEntity.ok(ApiResult.success(userResponseDto,
            "Usuario encontrado exitosamente."));
    }



}
