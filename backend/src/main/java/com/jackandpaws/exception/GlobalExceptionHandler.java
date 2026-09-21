package com.jackandpaws.exception;

import java.time.Instant;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    record ErrorResponse(Instant timestamp, int status, String message) {
    }

    @ExceptionHandler(ApiException.class)
    ResponseEntity<ErrorResponse> api(ApiException e) {
        return ResponseEntity.status(e.getStatus())
                .body(new ErrorResponse(Instant.now(), e.getStatus(), e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream().findFirst()
                .map(x -> x.getField() + ": " + x.getDefaultMessage()).orElse("Validation failed");
        return ResponseEntity.badRequest().body(new ErrorResponse(Instant.now(), 400, msg));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ErrorResponse> generic(Exception e) {
        return ResponseEntity.status(500).body(new ErrorResponse(Instant.now(), 500, "Unexpected server error"));
    }
}
