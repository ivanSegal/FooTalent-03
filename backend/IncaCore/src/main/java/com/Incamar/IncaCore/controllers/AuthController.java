package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.auth.LoginEndpointDoc;
import com.Incamar.IncaCore.documentation.auth.RegisterEndpointDoc;
import com.Incamar.IncaCore.dtos.users.LoginRequestDto;
import com.Incamar.IncaCore.dtos.users.RegisterRequestDto;
import com.Incamar.IncaCore.services.AuthService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "01 - Autenticación",
    description = "Endpoints para autenticación de usuarios y gestión de cuentas")
public class AuthController {

  private final AuthService authService;

  @LoginEndpointDoc
  @PostMapping("/login")
  public ResponseEntity<ApiResult<?>> login(@Valid @RequestBody LoginRequestDto request) {
    String token = authService.login(request);
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token);
    Map<String, String> data = Map.of("token", token);
    return ResponseEntity.ok()
        .headers(headers)
        .body(ApiResult.success(data, "Login exitoso"));
  }

  @RegisterEndpointDoc
  @PostMapping("/register")
  public ResponseEntity<ApiResult<?>> register(@Valid @RequestBody RegisterRequestDto request) {
    authService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResult.success( "Registro exitoso"));
  }
}
