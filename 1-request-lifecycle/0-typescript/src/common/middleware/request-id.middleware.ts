/**
 * Middleware assigning `x-request-id` to every request — end-to-end log tracing.
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
     * Ensure every request has `x-request-id` for end-to-end log tracing.
     */
    use(req: Request, res: Response, next: NextFunction) {
        // Prioritize upstream request-id to preserve trace continuity across services.
        const requestId = req.header("x-request-id") ?? randomUUID()
        // Attach to request so downstream components can reuse the same value.
        req.headers["x-request-id"] = requestId
        // Echo back to response so client or API gateway can correlate during debugging.
        res.setHeader("x-request-id",
            requestId)
        next()
    }
}
