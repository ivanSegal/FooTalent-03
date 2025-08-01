package com.Incamar.IncaCore.security;

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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

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
  private final UserService userDetailsService;

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
      final String username = jwtService.extractUsername(token);

      if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(token, userDetails)) {
          throw new UnauthorizedException("Token inválido");
        }
        Boolean twoFaPending = jwtService.extractTwoFaPending(token);

        boolean is2FaVerificationEndpoint = path.equals("/static/auth/2fa/validate");
        if (Boolean.TRUE.equals(twoFaPending) && !is2FaVerificationEndpoint) {
          throw new UnauthorizedException("2FA verification required");
        }
        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
      }
      filterChain.doFilter(request, response);
    } catch (ExpiredJwtException e) {
      throw new UnauthorizedException("Token expirado", e);
    } catch (JwtException | IllegalArgumentException e) {
      throw new UnauthorizedException("Token inválido", e);
    }
  }
}
