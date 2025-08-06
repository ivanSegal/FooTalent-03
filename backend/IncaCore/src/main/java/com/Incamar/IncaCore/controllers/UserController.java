package com.Incamar.IncaCore.controllers;
import com.Incamar.IncaCore.documentation.user.*;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.dtos.users.UserRequestDto;
import com.Incamar.IncaCore.dtos.users.UserResponseDto;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.services.UserService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResult<?>> getAllUsers(@ParameterObject Pageable pageable) {
        Page<UserResponseDto> users = userService.getAllUsers(pageable);
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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @CreateUserEndpointDoc
    public ResponseEntity<String> createUser(@Valid @RequestBody UserRequestDto request) {
        userService.createUser(
                request.getUsername(),
                request.getPassword(),
                Role.valueOf(request.getRole()),
                request.getCreatedAt()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Usuario creado correctamente.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @DeleteUserEndpointDoc
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    @UpdateUserEndpointDoc
    public ResponseEntity<User> editUser(@PathVariable UUID id,
                                                       @Valid @RequestBody UserRequestDto request) {
        User updatedUser =userService.editUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    @SearchUsersEndpointDoc
    public ResponseEntity<Page<UserResponseDto>> searchUsers(@RequestParam("username") String username, @ParameterObject Pageable pageable) {
        Page<UserResponseDto> result = userService.searchUsersByUsername(username, pageable);
        return ResponseEntity.ok(result);
    }





}
