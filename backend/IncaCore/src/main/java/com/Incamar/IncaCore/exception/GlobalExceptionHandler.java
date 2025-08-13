package com.Incamar.IncaCore.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex, HttpServletRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "INTERNAL_ERROR",
            "Ocurrió un error interno en el servidor",
            Collections.singletonList(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
    var details = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(f -> f.getField() + ": " + f.getDefaultMessage())
            .collect(Collectors.toList());

    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "VALIDATION_ERROR",
            "Falló la validación de los campos",
            details,
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "BAD_REQUEST",
            ex.getMessage(),
            Collections.singletonList(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletRequest request) {
    String message = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            "DATA_INTEGRITY_VIOLATION",
            "Se intento añadir un valor repetido a un campo unico",
            Collections.singletonList(message),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            "BAD_CREDENTIALS",
            "Credenciales inválidas",
            List.of(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.FORBIDDEN.value(),
            "ACCESS_DENIED",
            "Acceso denegado: no tienes permiso para acceder a este recurso.",
            Collections.singletonList(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  @ExceptionHandler(MailSendException.class)
  public ResponseEntity<ErrorResponse> handleMailSendException(MailSendException ex, HttpServletRequest request) {
    String message = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.SERVICE_UNAVAILABLE.value(),
            "MAIL_SEND_ERROR",
            "Error al enviar el correo electrónico: " + message,
            Collections.singletonList(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
  }

  @ExceptionHandler(org.springframework.web.bind.MissingServletRequestParameterException.class)
  public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(org.springframework.web.bind.MissingServletRequestParameterException ex, HttpServletRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "MISSING_PARAMETER",
            "Falta un parámetro obligatorio: " + ex.getParameterName(),
            Collections.singletonList(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(org.springframework.http.converter.HttpMessageNotReadableException ex, HttpServletRequest request) {
    ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "MESSAGE_NOT_READABLE",
            "El cuerpo de la solicitud es inválido o está mal formado",
            List.of(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(InvalidPasswordException.class)
  public ResponseEntity<ErrorResponse> handleInvalidPasswordException(InvalidPasswordException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "INVALID_PASSWORD",
            ex.getMessage(),
            Collections.singletonList(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(InvalidTokenException.class)
  public ResponseEntity<ErrorResponse> handleInvalidToken(InvalidTokenException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            "INVALID_TOKEN",
            "Token inválido",
            Collections.singletonList(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            "USER_NOT_FOUND",
            "Usuario no encontrado",
            Collections.singletonList(ex.getMessage()),
            request.getRequestURI()
    );
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }
  }
