package com.Incamar.IncaCore.services;

import java.time.LocalDateTime;

public interface TokenBlacklistService {

    void addTokenToBlacklist(String token, LocalDateTime tokenExpirationDate);

    boolean isTokenBlacklisted(String token);

}
