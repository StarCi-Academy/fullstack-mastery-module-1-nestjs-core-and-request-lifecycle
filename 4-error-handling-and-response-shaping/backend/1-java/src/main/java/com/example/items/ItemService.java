package com.example.items;

import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Service handling in-memory item data + source of error kinds for the error-handling demo.
 */
@Service
public class ItemService {

    // In-memory data so the lesson focuses on error handling instead of DB setup.
    private final List<Item> items = List.of(
            new Item(1, "keyboard"),
            new Item(2, "mouse"));

    /**
     * Return item detail by id — throw ItemNotFoundException (expected error) when missing.
     */
    public Item find(int id) {
        return items.stream()
                .filter(it -> it.id() == id)
                .findFirst()
                // Expected domain error: a safe message we author → the advice keeps it as-is.
                .orElseThrow(() -> new ItemNotFoundException("Item " + id + " not found"));
    }

    /**
     * Simulate an unexpected runtime failure — throw a RuntimeException (not an expected error).
     */
    public Item explode() {
        // Unexpected error: the real message is unsafe → the advice masks it with "Internal server error".
        throw new RuntimeException("boom: simulated internal failure with secret detail");
    }
}
