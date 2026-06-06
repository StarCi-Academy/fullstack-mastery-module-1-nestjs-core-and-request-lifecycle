package academy.starci.requestlifecycle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application is the Spring Boot entry point for the request/response lifecycle demo.
 */
@SpringBootApplication
public class Application {
    /**
     * main boots the Spring Boot context and the web server.
     *
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
