package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot entry point for the error-handling lesson.
 */
@SpringBootApplication
public class DemoApplication {

    /**
     * Boot the application — Spring component-scans (controller, advice, service).
     */
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
