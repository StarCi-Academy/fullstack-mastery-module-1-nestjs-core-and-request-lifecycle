/**
 * Guard validating the role via `?role=` query param — only `admin` passes,
 * any other role is blocked with HTTP 403.
 */
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common"

/**
 * Role token allowed to access the protected route.
 */
const ALLOWED_ROLE = "admin"

@Injectable()
export class RoleGuard implements CanActivate {
    /**
     * Read `role` from the request's query string and decide pass / 403.
     */
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<{ query: Record<string, string | undefined> }>()
        // Read directly from `req.query` — not `process.env` because this is a per-request decision.
        const role = req.query?.role
        if (role === ALLOWED_ROLE) {
            return true
        }
        // Throw `ForbiddenException` so Nest maps it to a standard HTTP 403 instead of 500.
        throw new ForbiddenException(`Role "${role ?? "<missing>"}" is not allowed; expected "${ALLOWED_ROLE}"`)
    }
}
