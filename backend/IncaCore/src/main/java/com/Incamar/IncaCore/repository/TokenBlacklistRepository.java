package com.Incamar.IncaCore.repository;

import com.Incamar.IncaCore.entity.TokenBlacklist;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenBlacklistRepository extends JpaRepository <TokenBlacklist, Long> {

    Optional<TokenBlacklist> findByToken(String token);

    void deleteByExpirationDateBefore(LocalDateTime dateTime);

    boolean existsByToken(String token);
}
