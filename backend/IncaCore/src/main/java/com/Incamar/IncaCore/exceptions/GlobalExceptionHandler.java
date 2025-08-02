package com.Incamar.IncaCore.exceptions;


import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;


import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

  // This method handles all exceptions that are not specifically handled by other methods.
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleConflict(Exception ex, HttpServletRequest request) {

    ErrorResponse error = new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "INTERNAL_ERROR",
        "Internal Error Server",
        ex.getMessage(),
        request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }


  /** * This method handles IllegalArgumentException and MethodArgumentNotValidException.
   * It returns a 400 Bad Request response with details about the validation errors.
   * It checks if the exception is an instance of MethodArgumentNotValidException
   * and collects the field errors to provide detailed information.
   * * If the exception is an IllegalArgumentException, it returns a generic bad request response.
   *
   */
  @ExceptionHandler({IllegalArgumentException.class, MethodArgumentNotValidException.class})
  public ResponseEntity<ErrorResponse> handleBadRequestExceptions(Exception ex, HttpServletRequest request) {

    if (ex instanceof MethodArgumentNotValidException validationEx) {
      String details = validationEx.getBindingResult().getFieldErrors().stream()
          .map(f -> f.getField() + ": " + f.getDefaultMessage())
          .collect(Collectors.joining(", "));
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
          new ErrorResponse(
              HttpStatus.BAD_REQUEST.value(),
              "VALIDATION_ERROR",
              "Error validation with data",
              details,
              request.getRequestURI()
          )
      );
    } else if (ex instanceof IllegalArgumentException) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
          new ErrorResponse(
              HttpStatus.BAD_REQUEST.value(),
              "BAD_REQUEST",
              "Invalid argument provided",
              ex.getMessage(),
              request.getRequestURI()
          )
      );
    }

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(

        new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "BAD_REQUEST",
            "Bad request",
            ex.getMessage(),
            request.getRequestURI()
        )
    );
  }


  // This method handles UnauthorizedException and returns a 401 Unauthorized response.
  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
        HttpStatus.UNAUTHORIZED.value(),
        "UNAUTHORIZED",
        "Unauthorized access",
        ex.getMessage(),
        request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
  }

  // This method handles ForbiddenException and returns a 403 Forbidden response.
  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
        HttpStatus.FORBIDDEN.value(),
        "FORBIDDEN",
        "Access to the resource is forbidden",
        ex.getMessage(),
        request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
  }


  // This method handles ResourceNotFoundException and returns a 404 Not Found response.
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
        HttpStatus.NOT_FOUND.value(),
        "NOT_FOUND",
        "Resource not found",
        ex.getMessage(),
        request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }

  // This method handles ConflictException and returns a 409 Conflict response.
  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
        HttpStatus.CONFLICT.value(),
        "CONFLICT",
        "Resource already exists",
        ex.getMessage(),
        request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequestException(
      BadRequestException ex, HttpServletRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "BAD_REQUEST",
        ex.getMessage(),
        ex.toString(),
        request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(ServiceUnavailableException.class)
  public ResponseEntity<ErrorResponse> handleServiceUnavailable(ServiceUnavailableException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
        HttpStatus.SERVICE_UNAVAILABLE.value(),
        "SERVICE_UNAVAILABLE",
        "El servicio no está disponible temporalmente",
        ex.getMessage(),
        request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
  }

}
