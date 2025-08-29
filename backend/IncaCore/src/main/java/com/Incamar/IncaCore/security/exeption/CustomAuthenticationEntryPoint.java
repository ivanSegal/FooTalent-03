package com.Incamar.IncaCore.security.exeption;

import com.Incamar.IncaCore.exceptions.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request,
                       HttpServletResponse response,
                       AuthenticationException authException) throws IOException {
    ErrorResponse error = new ErrorResponse(
            HttpServletResponse.SC_UNAUTHORIZED,
            "AUTH_ERROR",
            "Acceso no autorizado. Token inválido o ausente.",
            List.of("Se requiere estar autenticado para acceder a este recurso"),
            request.getRequestURI()
    );
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json;charset=UTF-8");
    new ObjectMapper().writeValue(response.getWriter(), error);
  }

}
