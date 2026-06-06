package com.example.items;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller handling `/items` endpoint — raises 3 error kinds to demo the error convergence point.
 */
@RestController
public class ItemController {

    private final ItemService itemService;

    /**
     * Inject service to keep controller thin and testable.
     */
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    /**
     * Handle `GET /items/explode` — trigger an unexpected runtime error (static route, matched before `{id}`).
     */
    @GetMapping("/items/explode")
    public Item explode() {
        return itemService.explode();
    }

    /**
     * Handle `GET /items/{id}` — validate id (400) before business logic, throw 404 if missing.
     */
    @GetMapping("/items/{id}")
    public Item findOne(@PathVariable int id) {
        // Validate before business logic — only accept a positive integer.
        if (id <= 0) {
            throw new IllegalArgumentException("id must be a positive integer");
        }

        return itemService.find(id);
    }
}
