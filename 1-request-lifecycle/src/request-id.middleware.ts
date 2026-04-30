import {
    Injectable, NestMiddleware 
} from "@nestjs/common"
import {
    randomUUID 
} from "crypto"
import {
    NextFunction, Request, Response 
} from "express"

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    /**
   * Bảo đảm mọi request đều có `x-request-id` để trace log xuyên suốt pipeline
   * (EN: ensure every request has `x-request-id` for end-to-end log tracing).
   *
   * @param req - HTTP request hiện tại (EN: current HTTP request).
   * @param res - HTTP response hiện tại (EN: current HTTP response).
   * @param next - Hàm chuyển sang middleware tiếp theo (EN: callback to next middleware).
   * @returns void - Không trả dữ liệu (EN: no return value).
   * @sideEffects Ghi header `x-request-id` vào cả request và response
   * (EN: writes `x-request-id` header into both request and response).
   */
    use(req: Request, res: Response, next: NextFunction) {
    // Ưu tiên request-id từ upstream gateway để giữ tính liên tục trace giữa nhiều service
    // (EN: prioritize upstream request-id to preserve trace continuity across services).
        const requestId = req.header("x-request-id") ?? randomUUID()
        // Gắn vào request để downstream components (guard/interceptor/controller) dùng chung
        // (EN: attach to request so downstream components can reuse the same value).
        req.headers["x-request-id"] = requestId
        // Echo về response để client hoặc API gateway dễ correlate khi debug
        // (EN: echo back to response so client or API gateway can correlate during debugging).
        res.setHeader("x-request-id",
            requestId)
        next()
    }
}
