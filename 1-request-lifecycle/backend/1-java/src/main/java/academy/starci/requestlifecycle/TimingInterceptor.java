package academy.starci.requestlifecycle;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * TimingInterceptor records the start mark (nano) in preHandle so ResponseEnvelopeAdvice can compute executionMs.
 */
@Component
public class TimingInterceptor implements HandlerInterceptor {
    /**
     * preHandle runs after the route matches but before the handler — records the start mark into a request attribute.
     *
     * @param request the HTTP request
     * @param response the HTTP response
     * @param handler the selected handler
     * @return always true to let the request proceed
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Record the start mark into the request — only the later layer (advice) reads it back to compute executionMs.
        request.setAttribute("startNs", System.nanoTime());
        return true;
    }
}
