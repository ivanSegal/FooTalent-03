package com.Incamar.IncaCore.service;

import com.Incamar.IncaCore.entity.User;

import java.time.LocalDateTime;

public interface TokenBlacklistService {

    void addTokenToBlacklist(String token, LocalDateTime tokenExpirationDate);

    boolean isTokenBlacklisted(String token);

}
