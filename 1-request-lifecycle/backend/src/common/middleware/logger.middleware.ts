/**
 * Middleware ghi access log sớm ở đầu request — quan sát traffic realtime.
 * (EN: Middleware logging access early at request start — observe realtime traffic.)
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
     * Ghi access log sớm ở đầu request để quan sát traffic realtime.
     * (EN: Log request access early to observe realtime traffic.)
     */
    use(req: Request, _res: Response, next: NextFunction) {
        const requestId = req.header("x-request-id")
        // Log đủ method + path + request-id để truy vết theo từng request cụ thể.
        // (EN: Include method + path + request-id for per-request traceability.)
        console.log(
            `[LoggerMiddleware] ${req.method} ${req.originalUrl} requestId=${requestId ?? "n/a"}`,
        )
        next()
    }
}
