package academy.starci.requestlifecycle;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * ApiExceptionHandler normalizes every error into the {message,error,statusCode} shape (the error convergence point).
 */
@RestControllerAdvice
public class ApiExceptionHandler {
    /**
     * body builds the error map in message → error → statusCode order.
     *
     * @param message the error message
     * @param status the HTTP status
     * @return the normalized error map
     */
    private Map<String, Object> body(String message, HttpStatus status) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("message", message);
        map.put("error", status.getReasonPhrase());
        map.put("statusCode", status.value());
        return map;
    }

    /**
     * handleConstraintViolation maps Bean Validation (@Min) failures to HTTP 400.
     *
     * @param ex the constraint violation exception
     * @return a 400 response with the standard shape
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        // Take the first constraint message (e.g. "id must be a positive integer").
        String message = ex.getConstraintViolations().stream()
                .findFirst()
                .map(ConstraintViolation::getMessage)
                .orElse("Bad Request");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body(message, HttpStatus.BAD_REQUEST));
    }

    /**
     * handleForbiddenRole maps role authorization failures to HTTP 403.
     *
     * @param ex the forbidden role exception
     * @return a 403 response with the standard shape
     */
    @ExceptionHandler(ForbiddenRoleException.class)
    public ResponseEntity<Map<String, Object>> handleForbiddenRole(ForbiddenRoleException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body(ex.getMessage(), HttpStatus.FORBIDDEN));
    }
}
