/**
 * Middleware gán `x-request-id` cho mọi request — trace log xuyên suốt pipeline.
 * (EN: Middleware assigning `x-request-id` to every request — end-to-end log tracing.)
 */
import {
    Injectable,
    NestMiddleware,
} from "@nestjs/common"
import {
    randomUUID,
} from "crypto"
import {
    NextFunction,
    Request,
    Response,
} from "express"

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    /**
     * Bảo đảm mỗi request đều có `x-request-id` để trace log xuyên suốt pipeline.
     * (EN: Ensure every request has `x-request-id` for end-to-end log tracing.)
     */
    use(req: Request, res: Response, next: NextFunction) {
        // Ưu tiên request-id từ upstream gateway để giữ tính liên tục trace giữa nhiều service.
        // (EN: Prioritize upstream request-id to preserve trace continuity across services.)
        const requestId = req.header("x-request-id") ?? randomUUID()
        // Gắn vào request để downstream components (guard/interceptor/controller) dùng chung.
        // (EN: Attach to request so downstream components can reuse the same value.)
        req.headers["x-request-id"] = requestId
        // Echo về response để client hoặc API gateway dễ correlate khi debug.
        // (EN: Echo back to response so client or API gateway can correlate during debugging.)
        res.setHeader("x-request-id",
            requestId)
        next()
    }
}
