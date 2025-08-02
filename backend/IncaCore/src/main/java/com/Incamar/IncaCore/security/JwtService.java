package com.Incamar.IncaCore.security;

import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secretKey;

  @Value("${jwt.expiration}")
  private long jwtExpiration;

  private Key signingKey;

  @PostConstruct
  public void init() {
    if (secretKey.length() < 32) {
      throw new IllegalArgumentException(
          "El secret JWT debe tener al menos 32 caracteres para HS256.");
    }
    this.signingKey = Keys.hmacShaKeyFor(secretKey.getBytes());
  }

  public String generateToken(JwtDataDto d) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("userId", d.getUuid());
    claims.put("username", d.getUsername());
    claims.put("role", d.getRole());
    return buildToken(claims, d.getUsername(), jwtExpiration);
  }

  private String buildToken(Map<String, Object> claims, String subject, long expiration) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(new Date(now))
        .setExpiration(new Date(now + expiration))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }


  public String extractUsername(String token) {
    return extractAllClaims(token).getSubject();
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(signingKey)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  public UUID extractUserId(String token) {
    Claims claims = extractAllClaims(token);
    String userIdString = claims.get("userId", String.class);
    return UUID.fromString(userIdString);
  }

  public String extractRole(String token) {
    Claims claims = extractAllClaims(token);
    return claims.get("role", String.class);
  }
}
