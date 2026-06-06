package com.example.cat;

import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Business-logic service for cat data.
 *
 * <p>{@code @Service} registers this class as a singleton bean in Spring's IoC
 * container — equivalent to NestJS's {@code @Injectable()}. The container creates
 * exactly one instance and injects it wherever required (e.g., into
 * {@link CatController} and {@code DogService}).
 */
@Service
public class CatService {

    /**
     * Shared, immutable cat dataset used by all public methods.
     * Static data keeps the lesson focused on DI rather than database setup.
     */
    private final List<Cat> cats = List.of(new Cat(1, "Milo"), new Cat(2, "Luna"));

    /**
     * Return the full cat list — consumed by {@code GET /cats}.
     *
     * @return immutable list of {@link Cat} records
     */
    public List<Cat> all() {
        // Return the in-memory list; no DB call needed for this DI demo.
        return cats;
    }

    /**
     * Provide a status hint string consumed by {@code DogService} via cross-module DI.
     *
     * <p>This method exists solely to prove that {@code DogService} can call methods
     * on the injected {@link CatService} without creating a new instance.
     *
     * @return fixed status string {@code "cat-network-ready"}
     */
    public String spyHint() {
        return "cat-network-ready";
    }
}
