package academy.starci.requestlifecycle;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * RoleInterceptor blocks requests whose role != admin with HTTP 403 before the handler (route-level authorization).
 */
@Component
public class RoleInterceptor implements HandlerInterceptor {
    /**
     * ALLOWED_ROLE is the only role allowed to access the restricted route.
     */
    private static final String ALLOWED_ROLE = "admin";

    /**
     * preHandle reads the role query, throws ForbiddenRoleException (→ 403) if invalid, blocking before the handler.
     *
     * @param request the HTTP request
     * @param response the HTTP response
     * @param handler the selected handler
     * @return true when the role is valid
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String role = request.getParameter("role");
        if (ALLOWED_ROLE.equals(role)) {
            return true;
        }
        // Throw so ApiExceptionHandler normalizes the 403 shape — the decision is independent of business logic.
        throw new ForbiddenRoleException(
                "Role \"" + (role == null ? "" : role) + "\" is not allowed; expected \"" + ALLOWED_ROLE + "\"");
    }
}
