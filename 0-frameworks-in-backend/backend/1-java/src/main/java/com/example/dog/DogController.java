package com.example.dog;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for the {@code /dogs/*} endpoints.
 *
 * <p>Demonstrates cross-package (cross-module) dependency injection: Spring
 * supplies {@link DogService}, which in turn receives {@code CatService} —
 * all without any {@code new} keyword in application code.
 */
@RestController
public class DogController {

    /** DogService injected by Spring; controller stays as a thin routing layer. */
    private final DogService dogService;

    /**
     * Constructor injection — Spring resolves {@link DogService} from its context.
     *
     * @param dogService the singleton {@link DogService} bean managed by Spring
     */
    public DogController(DogService dogService) {
        this.dogService = dogService;
    }

    /**
     * Handle {@code GET /dogs/spy} — proves DogService can call CatService across
     * the package boundary via injection.
     *
     * @return {@link DogService.SpyReport} with mission, dependency, and status fields
     */
    @GetMapping("/dogs/spy")
    public DogService.SpyReport spy() {
        // Delegate entirely to service; controller has no business logic.
        return dogService.spyReport();
    }

    /**
     * Handle {@code GET /dogs/cats-via-di} — proves the injected CatService is the
     * same singleton instance shared with CatController.
     *
     * @return {@link DogService.CatsView} containing dog name and borrowed cat list
     */
    @GetMapping("/dogs/cats-via-di")
    public DogService.CatsView catsViaDI() {
        return dogService.catsViaDI();
    }
}
