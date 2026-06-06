package academy.starci.requestlifecycle;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.UUID;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * RequestIdFilter attaches the x-request-id header earliest (before DispatcherServlet) for tracing.
 */
@Component
@Order(1)
public class RequestIdFilter extends OncePerRequestFilter {
    /**
     * HEADER is the request correlation header name.
     */
    private static final String HEADER = "x-request-id";

    /**
     * doFilterInternal generates/reuses x-request-id, wrapping the request so later layers can read the header.
     *
     * @param request the original HTTP request
     * @param response the original HTTP response
     * @param chain the downstream filter chain
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        // Reuse the client-provided id if present, otherwise generate a new uuid.
        String existing = request.getHeader(HEADER);
        final String requestId = (existing == null || existing.isBlank()) ? UUID.randomUUID().toString() : existing;
        response.setHeader(HEADER, requestId);

        // Wrap the request so getHeader(x-request-id) always returns the id — original headers are immutable.
        HttpServletRequestWrapper wrapped = new HttpServletRequestWrapper(request) {
            @Override
            public String getHeader(String name) {
                if (HEADER.equalsIgnoreCase(name)) {
                    return requestId;
                }
                return super.getHeader(name);
            }

            @Override
            public Enumeration<String> getHeaders(String name) {
                if (HEADER.equalsIgnoreCase(name)) {
                    return Collections.enumeration(java.util.List.of(requestId));
                }
                return super.getHeaders(name);
            }
        };
        chain.doFilter(wrapped, response);
    }
}
