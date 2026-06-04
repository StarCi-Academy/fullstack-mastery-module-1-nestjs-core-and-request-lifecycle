package com.example.dog;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.cat.Cat;
import com.example.cat.CatService;

// DogService depends on CatService (another package/"module") via constructor
// injection. No "new CatService()" — Spring's container injects it.)
@Service
public class DogService {
    private final CatService cats;

    public DogService(CatService cats) {
        this.cats = cats;
    }

    // records keep field order -> {mission, dependency, status} / {dog, borrowedCats}.
    public record SpyReport(String mission, String dependency, String status) {
    }

    public record CatsView(String dog, List<Cat> borrowedCats) {
    }

    public SpyReport spyReport() {
        return new SpyReport("cross-module-dependency-check", cats.spyHint(), "ok");
    }

    // reuses the same CatService bean (singleton) -> same /cats data.
    public CatsView catsViaDI() {
        return new CatsView("Rex", cats.all());
    }
}
