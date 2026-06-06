package com.starci;

import java.io.IOException;
import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

/**
 * RequestIdFilter — attaches a requestId to MDC for all logs in one request, cleared in finally.
 */
@Component
@Order(1)
public class RequestIdFilter implements Filter {

    /**
     * doFilter — generates a requestId, puts it in MDC, ensures clear to avoid leakage across reused threads.
     *
     * @param request the servlet request).
     * @param response the servlet response).
     * @param chain the next filter chain).
     * @throws IOException on I/O error).
     * @throws ServletException on servlet error).
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // One requestId per request — put in MDC so LogstashEncoder serializes it along.
        MDC.put("requestId", UUID.randomUUID().toString());
        try {
            chain.doFilter(request, response);
        } finally {
            // Must clear at request end: the thread pool reuses threads.
            MDC.clear();
        }
    }
}
