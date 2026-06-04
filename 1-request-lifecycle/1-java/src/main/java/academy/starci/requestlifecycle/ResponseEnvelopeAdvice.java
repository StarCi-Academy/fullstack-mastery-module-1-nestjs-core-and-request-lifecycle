package academy.starci.requestlifecycle;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * ResponseEnvelopeAdvice wraps the handler payload into the standard envelope outbound (ResponseBodyAdvice).
 */
@RestControllerAdvice
public class ResponseEnvelopeAdvice implements ResponseBodyAdvice<Object> {
    /**
     * supports indicates the advice applies to every handler (errors are filtered in beforeBodyWrite).
     *
     * @param returnType the handler return type
     * @param converterType the HTTP message converter
     * @return always true
     */
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    /**
     * beforeBodyWrite runs after the handler, before serialization — wraps successful payloads into the envelope.
     *
     * @param body the payload returned by the handler
     * @param returnType the handler return type
     * @param selectedContentType the selected content type
     * @param selectedConverterType the selected message converter
     * @param request the server-side HTTP request
     * @param response the server-side HTTP response
     * @return the wrapped envelope, or the original body if it is an error
     */
    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request,
            ServerHttpResponse response) {
        // Skip the envelope for error responses (already shaped {message,error,statusCode} by ApiExceptionHandler).
        if (body instanceof Map<?, ?> map && map.containsKey("statusCode") && map.containsKey("error")) {
            return body;
        }

        HttpServletRequest http = ((ServletServerHttpRequest) request).getServletRequest();
        Object startNs = http.getAttribute("startNs");
        Long executionMs = startNs == null ? null : (System.nanoTime() - (long) startNs) / 1_000_000;

        // Use HashMap to keep a null requestId without it being rejected like Map.of.
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("data", body);
        envelope.put("timestamp", Instant.now().toString());
        envelope.put("requestId", Optional.ofNullable(http.getHeader("x-request-id")).orElse(null));
        envelope.put("executionMs", executionMs);
        return envelope;
    }
}
