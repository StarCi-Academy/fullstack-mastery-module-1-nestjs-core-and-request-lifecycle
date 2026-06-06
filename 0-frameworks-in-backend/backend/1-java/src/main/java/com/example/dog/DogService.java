package com.example.dog;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.cat.Cat;
import com.example.cat.CatService;

/**
 * Business-logic service for the dog domain.
 *
 * <p>Depends on {@link CatService} (a different package / "module") via constructor
 * injection. Spring injects the shared {@link CatService} singleton — no
 * {@code new CatService()} in application code (inversion of control).
 */
@Service
public class DogService {

    /** The injected CatService singleton — same instance used by CatController. */
    private final CatService cats;

    /**
     * Constructor injection — Spring reads the parameter type and supplies the matching bean.
     *
     * @param cats the singleton {@link CatService} bean managed by Spring's IoC container
     */
    public DogService(CatService cats) {
        this.cats = cats;
    }

    /**
     * Data record for the spy-report response.
     *
     * <p>Java records keep field declaration order, so Jackson serializes as
     * {@code {"mission":..,"dependency":..,"status":..}}.
     *
     * @param mission    fixed label describing the cross-module check
     * @param dependency status string fetched from {@link CatService#spyHint()}
     * @param status     always {@code "ok"} when injection succeeded
     */
    public record SpyReport(String mission, String dependency, String status) {
    }

    /**
     * Data record for the cats-via-DI response.
     *
     * @param dog         name of the dog borrowing the cat list
     * @param borrowedCats cat list fetched from the injected {@link CatService}
     */
    public record CatsView(String dog, List<Cat> borrowedCats) {
    }

    /**
     * Build a spy report to prove cross-package injection is working.
     *
     * @return {@link SpyReport} with data sourced from the injected {@link CatService}
     */
    public SpyReport spyReport() {
        // cats.spyHint() crosses the package boundary — Spring resolved it via DI, not manual new.
        return new SpyReport("cross-module-dependency-check", cats.spyHint(), "ok");
    }

    /**
     * Return the full cat list borrowed via the injected {@link CatService} singleton.
     *
     * <p>Because CatService is a Spring singleton, {@code cats.all()} returns the
     * same data as a direct {@code GET /cats} call — same instance, same data.
     *
     * @return {@link CatsView} containing dog name and the full cat list
     */
    public CatsView catsViaDI() {
        // Reuses the same CatService bean (singleton) — proves shared instance.
        return new CatsView("Rex", cats.all());
    }
}
