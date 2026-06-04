package com.example.dog;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DogController {
    private final DogService dogService;

    public DogController(DogService dogService) {
        this.dogService = dogService;
    }

    @GetMapping("/dogs/spy")
    public DogService.SpyReport spy() {
        return dogService.spyReport();
    }

    @GetMapping("/dogs/cats-via-di")
    public DogService.CatsView catsViaDI() {
        return dogService.catsViaDI();
    }
}
