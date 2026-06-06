package com.starci;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Application — Spring Boot entrypoint.
 *
 * <p>{@code @EnableConfigurationProperties(AppProperties.class)} registers the typed bean for the {@code app.*} namespace.</p>
 */
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class Application {

    /**
     * Boots the Spring context + embedded Tomcat.
     *
     * @param args command-line arguments).
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
