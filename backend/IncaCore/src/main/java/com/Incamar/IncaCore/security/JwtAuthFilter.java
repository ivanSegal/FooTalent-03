package com.Incamar.IncaCore.security;

import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.exceptions.UnauthorizedException;
import com.Incamar.IncaCore.services.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
  private static final List<String> PUBLIC_URLS = List.of(
      "/auth/login",
      "/auth/register",
      "/swagger-ui",
      "/swagger-ui/",
      "/swagger-ui.html",
      "/swagger-ui/**",
      "/v3/api-docs",
      "/v3/api-docs/**"
  );
  private final JwtService jwtService;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain) throws ServletException, IOException {

    String path = request.getRequestURI();

    if (PUBLIC_URLS.stream().anyMatch(path::startsWith)) {
      filterChain.doFilter(request, response);
      return;
    }

    final String authHeader = request.getHeader("Authorization");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token de autorización requerido");
    }

    final String token = authHeader.substring(7);

    try {
      if (SecurityContextHolder.getContext().getAuthentication() != null) {
        filterChain.doFilter(request, response);
        return;
      }

      String username = jwtService.extractUsername(token);
      String role = jwtService.extractRole(token);
      UUID uuid = jwtService.extractUserId(token);

      JwtDataDto jwtDataDto = new JwtDataDto();
      jwtDataDto.setUsername(username);
      jwtDataDto.setRole(role);
      jwtDataDto.setUuid(uuid);

      var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

      UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
          jwtDataDto,
          null,
          authorities
      );

      authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
      SecurityContextHolder.getContext().setAuthentication(authToken);

      filterChain.doFilter(request, response);

    } catch (ExpiredJwtException e) {
      throw new UnauthorizedException("Token expirado", e);
    } catch (JwtException | IllegalArgumentException e) {
      throw new UnauthorizedException("Token inválido", e);
    }
  }
}
