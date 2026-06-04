package com.example.cat;

import java.util.List;
import org.springframework.stereotype.Service;

// @Service marks the class for the IoC container (singleton bean by default).
// Equivalent to NestJS's @Injectable.)
@Service
public class CatService {
    private final List<Cat> cats = List.of(new Cat(1, "Milo"), new Cat(2, "Luna"));

    // all() -> GET /cats.
    public List<Cat> all() {
        return cats;
    }

    // spyHint() -> the piece the dog module consumes via DI.
    public String spyHint() {
        return "cat-network-ready";
    }
}
