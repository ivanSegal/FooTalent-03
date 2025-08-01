package com.Incamar.IncaCore.exceptions;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ErrorResponse {

    private int statusCode;
    private String errorCode;
    private String message;
    private String detailsError;
    private String path;

    public ErrorResponse(int statusCode, String errorCode, String message, String detailsError, String path) {
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.message = message;
        this.detailsError = detailsError;
        this.path = path;
    }


}
