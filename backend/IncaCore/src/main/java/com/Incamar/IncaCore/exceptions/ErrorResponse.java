package com.Incamar.IncaCore.exceptions;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
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

    public ErrorResponse (String errorCode, String message){
        this.errorCode = errorCode;
        this.message = message;
    }

}
