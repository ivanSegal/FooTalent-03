package com.Incamar.IncaCore.exceptions;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ErrorResponse {

    private String errorCode;
    private String message;
    private String detailsError;
    private String path;
    private long timestamp;

    public ErrorResponse(String errorCode, String message, String detailsError, String path) {
        this.errorCode = errorCode;
        this.message = message;
        this.detailsError = detailsError;
        this.path = path;
        this.timestamp = System.currentTimeMillis();
    }

    public ErrorResponse (String errorCode, String message){
        this.errorCode = errorCode;
        this.message = message;
    }

}
