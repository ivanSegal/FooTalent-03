package com.Incamar.IncaCore.models;

import com.Incamar.IncaCore.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = "username")})
@Access(AccessType.FIELD)
@Schema(description = "Entidad que representa un usuario del sistema con "
    + "capacidades de autenticación y autorización")
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(columnDefinition = "uuid DEFAULT gen_random_uuid()", updatable = false, nullable = false)
  @Schema(description = "Identificador único del usuario",
      example = "550e8400-e29b-41d4-a716-446655440000")
  private UUID id;

  @Column(nullable = false)
  @Schema(description = "Contraseña encriptada del usuario",
      example = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFdSsKpqjjP6yTr6UPFhCUy")
  private String password;

  @Column(nullable = false, length = 100)
  @Schema(
      description = "Nombre de usuario único. Solo acepta letras, números, puntos y guiones bajos",
      example = "juan.perez_92"
  )
  private String username;

  @Enumerated(EnumType.STRING)
  @Column()
  @Schema(description = "Rol del usuario en el sistema",
      example = "USER",
      implementation = Role.class)
  private Role role;

  @Schema(description = "Fecha y hora de creación de la cuenta",
      example = "2025-06-12T10:30:00.000Z",
      type = "string",
      format = "date-time")
  @Column(name = "created_at",
      updatable = false,
      insertable = false,
      nullable = false,
      columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  private LocalDateTime createdAt = LocalDateTime.now();


  // Métodos de UserDetails
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
  }

  @Override
  @Schema(description = "Contraseña del usuario para autenticación")
  public String getPassword() {
    return password;
  }

  @Override
  @Transient
  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

}
