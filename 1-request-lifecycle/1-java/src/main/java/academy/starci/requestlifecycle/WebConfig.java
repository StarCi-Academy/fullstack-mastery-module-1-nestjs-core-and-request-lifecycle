package academy.starci.requestlifecycle;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebConfig registers the HandlerInterceptors in correct lifecycle order.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    /**
     * timing is the interceptor recording the start mark for every route.
     */
    private final TimingInterceptor timing;

    /**
     * role is the authorization interceptor for the restricted route.
     */
    private final RoleInterceptor role;

    /**
     * Inject the two Spring-managed interceptors.
     *
     * @param timing the timing interceptor
     * @param role the role authorization interceptor
     */
    public WebConfig(TimingInterceptor timing, RoleInterceptor role) {
        this.timing = timing;
        this.role = role;
    }

    /**
     * addInterceptors attaches timing globally and role only to /items/restricted.
     *
     * @param registry the interceptor registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // timing is cross-cutting → global; role is context-dependent → only the sensitive route.
        registry.addInterceptor(timing).addPathPatterns("/**");
        registry.addInterceptor(role).addPathPatterns("/items/restricted");
    }
}
