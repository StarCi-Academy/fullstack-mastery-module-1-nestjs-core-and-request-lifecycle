package com.example.items;

/**
 * "Not found" domain error — expected, carrying a safe message (→ 404).
 */
public class ItemNotFoundException extends RuntimeException {

    /**
     * Construct with a safe message authored by the domain.
     */
    public ItemNotFoundException(String message) {
        super(message);
    }
}
