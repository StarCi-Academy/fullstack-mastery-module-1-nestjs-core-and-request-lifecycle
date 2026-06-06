package com.example.items;

import java.time.Instant;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global error convergence point — Spring routes every exception to the matching @ExceptionHandler.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Expected domain error → 404 with the safe message kept as-is.
     */
    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<ErrorEnvelope> handleNotFound(ItemNotFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), req);
    }

    /**
     * Expected validation error → 400 with the safe message kept as-is.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorEnvelope> handleBadRequest(IllegalArgumentException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req);
    }

    /**
     * Final catch-all for unexpected errors — most generic; mask the message, push the stack to internal logs.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorEnvelope> handleUnexpected(Exception ex, HttpServletRequest req) {
        // The stack trace is logged internally ONLY, never returned to the client.
        log.error("Unhandled {} {}", req.getMethod(), req.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", req);
    }

    /**
     * Shape the standard error envelope — the single place that decides what the client sees.
     */
    private ResponseEntity<ErrorEnvelope> build(HttpStatus status, String message, HttpServletRequest req) {
        ErrorEnvelope body = new ErrorEnvelope(
                status.value(),
                status.getReasonPhrase(),
                message,
                Instant.now().toString(),
                req.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }
}
