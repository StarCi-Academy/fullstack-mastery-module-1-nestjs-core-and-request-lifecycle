package academy.starci.requestlifecycle;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * LoggerFilter writes a one-line access log per request (runs after RequestIdFilter).
 */
@Component
@Order(2)
public class LoggerFilter extends OncePerRequestFilter {
    /**
     * doFilterInternal passes control to the next layer (access log hook point).
     *
     * @param request the original HTTP request
     * @param response the original HTTP response
     * @param chain the downstream filter chain
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        chain.doFilter(request, response);
    }
}
