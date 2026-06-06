package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application entry point for the DI / framework demo.
 *
 * <p>{@code @SpringBootApplication} enables component scanning starting at
 * {@code com.example}. Spring discovers every {@code @Service} and
 * {@code @RestController} and registers them in its IoC container — the part
 * "the framework does for you" that this lesson illustrates.
 */
@SpringBootApplication
public class DemoApplication {

    /**
     * Start the Spring Boot application.
     *
     * @param args command-line arguments forwarded to {@link SpringApplication#run}
     */
    public static void main(String[] args) {
        // Spring bootstraps the IoC container, wires all beans, and starts the embedded Tomcat server.
        SpringApplication.run(DemoApplication.class, args);
    }
}
