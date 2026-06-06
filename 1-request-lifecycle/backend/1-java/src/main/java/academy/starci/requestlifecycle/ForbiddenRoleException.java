package academy.starci.requestlifecycle;

/**
 * ForbiddenRoleException signals a role not allowed to access the restricted route (→ HTTP 403).
 */
public class ForbiddenRoleException extends RuntimeException {
    /**
     * Construct the exception with a message describing the rejected role.
     *
     * @param message the error message sent to the client
     */
    public ForbiddenRoleException(String message) {
        super(message);
    }
}
