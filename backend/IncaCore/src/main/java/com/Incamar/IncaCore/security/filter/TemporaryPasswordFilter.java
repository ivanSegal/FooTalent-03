package com.Incamar.IncaCore.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.Incamar.IncaCore.exception.ErrorResponse;
import com.Incamar.IncaCore.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TemporaryPasswordFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Si no hay autenticación, dejamos pasar (es endpoint público o login)
        if (authentication == null || !authentication.isAuthenticated()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Obtenemos el token desde el header (ya validado en JwtAuthenticationFilter)
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;

        if (token != null) {
            boolean isTemporaryPassword = jwtService.extractTemporaryPasswordFlag(token);

            if (isTemporaryPassword) {
                String path = request.getServletPath();

                // Permitimos solo el endpoint de cambio de contraseña temporal
                if (!path.equals("/api/auth/change-password/temporary")) {
                    log.warn("Usuario con contraseña temporal intentando acceder a: {}", path);
                    ErrorResponse errorResponse = new ErrorResponse(
                            HttpStatus.FORBIDDEN.value(),
                            "TEMPORARY_PASSWORD",
                            "Debe cambiar su contraseña temporal antes de continuar.",
                            List.of(),
                            request.getRequestURI()
                    );

                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType("application/json");
                    new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}

