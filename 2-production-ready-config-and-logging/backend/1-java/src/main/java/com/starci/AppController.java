package com.starci;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AppController — reads the typed bean (via AppService) and logs through the unified SLF4J root logger.
 */
@RestController
public class AppController {

    // SLF4J logger bubbles up to <root> in logback-spring.xml — sharing the pipeline with Spring logs.
    private static final Logger log = LoggerFactory.getLogger(AppController.class);

    // Injected service — thin controller, no config logic inside.
    private final AppService appService;

    /**
     * Inject AppService.
     *
     * @param appService the payload-building service).
     */
    public AppController(AppService appService) {
        this.appService = appService;
    }

    /**
     * GET / — emits runtime identity from config.
     *
     * @return the status map).
     */
    @GetMapping("/")
    public Map<String, Object> getStatus() {
        // structured log: SLF4J attaches level/timestamp/logger_name (+ requestId from MDC) then fans out.
        log.info("GET / called - returning runtime config status");
        return appService.getStatus();
    }

    /**
     * GET /config — returns the typed snapshot with all 5 fields.
     *
     * @return the config map).
     */
    @GetMapping("/config")
    public Map<String, Object> getConfig() {
        log.info("GET /config called - returning AppConfig snapshot");
        return appService.getConfigSnapshot();
    }
}
