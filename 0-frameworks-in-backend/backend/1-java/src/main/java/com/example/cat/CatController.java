package com.example.cat;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for the {@code /cats} endpoint.
 *
 * <p>{@code @RestController} combines {@code @Controller} + {@code @ResponseBody}.
 * Spring resolves the {@link CatService} dependency via constructor injection — no
 * manual {@code new} required.
 */
@RestController
public class CatController {

    /** Injected by Spring's IoC container; controller stays free of data logic. */
    private final CatService catService;

    /**
     * Constructor injection — Spring detects the single constructor and supplies
     * the matching bean from its context.
     *
     * @param catService the singleton {@link CatService} bean managed by Spring
     */
    public CatController(CatService catService) {
        this.catService = catService;
    }

    /**
     * Handle {@code GET /cats} — demonstrates controller → service delegation.
     *
     * @return list of all cats; Jackson serializes each as {@code {"id":.,"name":..}}
     */
    @GetMapping("/cats")
    public List<Cat> cats() {
        // Delegate to service; controller only routes the request.
        return catService.all();
    }
}
