/**
 * Guard kiểm tra role qua query param `?role=` — chỉ cho phép `admin` đi qua,
 * mọi role khác đều bị chặn với HTTP 403.
 * (EN: Guard validating the role via `?role=` query param — only `admin` passes,
 * any other role is blocked with HTTP 403.)
 */
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common"

/**
 * Token role được phép truy cập route được bảo vệ.
 * (EN: Role token allowed to access the protected route.)
 */
const ALLOWED_ROLE = "admin"

@Injectable()
export class RoleGuard implements CanActivate {
    /**
     * Đọc `role` từ query string của request và quyết định pass / 403.
     * (EN: Read `role` from the request's query string and decide pass / 403.)
     */
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<{ query: Record<string, string | undefined> }>()
        // Lấy trực tiếp từ `req.query` — không dùng `process.env` vì đây là per-request decision.
        // (EN: Read directly from `req.query` — not `process.env` because this is a per-request decision.)
        const role = req.query?.role
        if (role === ALLOWED_ROLE) {
            return true
        }
        // Ném `ForbiddenException` để Nest map thành HTTP 403 chuẩn thay vì 500.
        // (EN: Throw `ForbiddenException` so Nest maps it to a standard HTTP 403 instead of 500.)
        throw new ForbiddenException(`Role "${role ?? "<missing>"}" is not allowed; expected "${ALLOWED_ROLE}"`)
    }
}
