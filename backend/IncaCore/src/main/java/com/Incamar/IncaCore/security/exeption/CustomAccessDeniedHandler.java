package com.Incamar.IncaCore.security.exeption;

import com.Incamar.IncaCore.exceptions.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private static final Logger log = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        log.error("❌ AccessDeniedHandler invoked for URI: {}", request.getRequestURI());

        ErrorResponse error = new ErrorResponse(
                HttpServletResponse.SC_UNAUTHORIZED,
                "AUTH_ERROR",
                "Acceso no autorizado. Token inválido o ausente.",
                List.of(accessDeniedException.getMessage()),
                request.getRequestURI()
        );

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), error);
    }


}
