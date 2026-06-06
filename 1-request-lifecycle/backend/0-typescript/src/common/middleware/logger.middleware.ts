/**
 * Middleware logging access early at request start — observe realtime traffic.
 */
import {
    Injectable,
    NestMiddleware,
} from "@nestjs/common"
import {
    NextFunction,
    Request,
    Response,
} from "express"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    /**
     * Log request access early to observe realtime traffic.
     */
    use(req: Request, _res: Response, next: NextFunction) {
        const requestId = req.header("x-request-id")
        // Include method + path + request-id for per-request traceability.
        console.log(
            `[LoggerMiddleware] ${req.method} ${req.originalUrl} requestId=${requestId ?? "n/a"}`,
        )
        next()
    }
}
