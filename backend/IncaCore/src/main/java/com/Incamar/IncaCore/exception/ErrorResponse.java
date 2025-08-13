package com.Incamar.IncaCore.exception;

import java.util.List;

public record ErrorResponse(
        int statusCode,
        String errorCode,
        String message,
        List<String> details,
        String path
) {}
