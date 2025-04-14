package com.meet.chatty.controller;

import com.meet.chatty.dto.response.ErrorResponse;
import com.meet.chatty.error.JwtException;
import com.meet.chatty.error.UserException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ErrorController {

    @ExceptionHandler({UserException.class})
    public ResponseEntity<ErrorResponse> userError(UserException e) {
        System.out.println(e.getMessage());
        return ResponseEntity
                .status(e.getStatusCode())
                .body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler({JwtException.class})
    public ResponseEntity<ErrorResponse> jwtError(JwtException e) {
        System.out.println(e.getMessage());
        return ResponseEntity
                .badRequest()
                .body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> validationErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            validationErrors.put(error.getField(), error.getDefaultMessage());
        }
        ErrorResponse errorResponse = new ErrorResponse("Validation failed", validationErrors);
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        System.out.println("HttpMessageNotReadableException: " + ex.getMessage());
        ErrorResponse errorResponse = new ErrorResponse("Invalid or missing request body");
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler({Exception.class})
    public ResponseEntity<String> genericError(Exception e) {
        System.out.println(e.getMessage());
        System.out.println(e.getClass());
        return ResponseEntity.internalServerError().build();
    }
}
