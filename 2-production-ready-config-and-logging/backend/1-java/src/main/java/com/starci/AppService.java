package com.starci;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

/**
 * AppService — aggregates the logic building the status/config payload from the typed bean.
 */
@Service
public class AppService {

    // Typed config bean injected once — the service never reads System.getenv directly.
    private final AppProperties props;

    /**
     * Inject the AppProperties bean.
     *
     * @param props the typed configuration bean).
     */
    public AppService(AppProperties props) {
        this.props = props;
    }

    /**
     * getStatus — runtime identity payload for GET /.
     *
     * @return an ordered map of contract fields).
     */
    public Map<String, Object> getStatus() {
        // LinkedHashMap to keep a stable key order in the JSON response.
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", props.nodeEnv() + " - config-and-logging-ready");
        body.put("env", props.nodeEnv());
        body.put("appName", props.name());
        body.put("appVersion", props.version());
        body.put("appPort", props.port());
        return body;
    }

    /**
     * getConfigSnapshot — the 5-field snapshot for GET /config (matching the AppProperties record).
     *
     * @return a 5-field typed config map).
     */
    public Map<String, Object> getConfigSnapshot() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("name", props.name());
        body.put("version", props.version());
        body.put("port", props.port());
        body.put("nodeEnv", props.nodeEnv());
        body.put("logFilePath", props.logFilePath());
        return body;
    }
}
