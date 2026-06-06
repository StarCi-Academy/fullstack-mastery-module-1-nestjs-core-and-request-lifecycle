package com.example.items;

/**
 * Normalized error envelope — the consistent error contract the client parses as an interface.
 */
public record ErrorEnvelope(
        int statusCode,
        String error,
        String message,
        String timestamp,
        String path) {
}
