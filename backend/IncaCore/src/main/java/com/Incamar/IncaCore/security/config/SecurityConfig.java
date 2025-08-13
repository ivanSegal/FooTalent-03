package com.Incamar.IncaCore.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.Incamar.IncaCore.exception.ErrorResponse;
import com.Incamar.IncaCore.security.filter.TemporaryPasswordFilter;
import com.Incamar.IncaCore.security.filter.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final TemporaryPasswordFilter temporaryPasswordFilter;
    private final AuthenticationProvider authenticationProvider;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password"
                        ).permitAll()
                        .requestMatchers(
                                "api/v1/auth/**",
                                "api/v1/role",
                                "/swagger-ui/**",
                                "/swagger-ui",
                                "/swagger-ui.html",
                                "/v3/api-docs",
                                "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                ).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(temporaryPasswordFilter, JwtAuthenticationFilter.class)
                .exceptionHandling(custom->custom
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler()))
                .build();
    }

    /**
     * This method customize the message for unauthorized access.
     *
     * @return AuthenticationEntryPoint
     */
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            ErrorResponse error = new ErrorResponse(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "AUTH_ERROR",
                    "Acceso no autorizado. Token inválido o ausente.",
                    List.of(authException.getMessage()),
                    request.getRequestURI()
            );

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getWriter(), error);
        };
    }

    /**
     * This method handled the logic associated with exceptions for insufficient permissions.
     *
     * @return AccessDeniedHandler
     */
    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpServletResponse.SC_FORBIDDEN,
                    "ACCESS_DENIED",
                    "Acceso denegado: no tienes permiso para acceder a este recurso.",
                    List.of(accessDeniedException.getMessage()),
                    request.getRequestURI()
            );

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
        };
    }
}
