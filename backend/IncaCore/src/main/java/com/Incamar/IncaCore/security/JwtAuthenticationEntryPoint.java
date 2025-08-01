package com.Incamar.IncaCore.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request,
                       HttpServletResponse response,
                       AuthenticationException authException) throws IOException {

    String origin = request.getHeader("Origin");
    if (origin != null) {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Accees-Control-Allow-Credentials", "true");
    }
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    ErrorResponse error = new ErrorResponse(
        HttpServletResponse.SC_UNAUTHORIZED,
        "Acceso no autorizado",
        "AUTH_ERROR",
        authException.getMessage(),
        request.getRequestURI()
    );

    new ObjectMapper().writeValue(response.getWriter(), error);
  }
}
