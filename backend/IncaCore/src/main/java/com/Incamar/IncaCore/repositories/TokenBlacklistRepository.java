package com.Incamar.IncaCore.repositories;

import com.Incamar.IncaCore.models.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenBlacklistRepository extends JpaRepository <TokenBlacklist, Long> {

    Optional<TokenBlacklist> findByToken(String token);

    void deleteByExpirationDateBefore(LocalDateTime dateTime);

    boolean existsByToken(String token);
}
