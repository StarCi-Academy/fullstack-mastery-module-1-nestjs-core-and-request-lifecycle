package com.starci;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * AppProperties — the SINGLE typed namespace mapping every {@code app.*} key (yml/env) into a record.
 *
 * The only place touching raw config; the rest injects the bean and reads {@code props.port()}.)</p>
 *
 * @param name application name).
 * @param version application version).
 * @param port HTTP port).
 * @param nodeEnv runtime environment).
 * @param logFilePath log file path).
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String name,
        String version,
        int port,
        String nodeEnv,
        String logFilePath) {
}
