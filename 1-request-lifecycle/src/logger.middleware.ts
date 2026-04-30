import {
    Injectable, NestMiddleware 
} from "@nestjs/common"
import {
    NextFunction, Request, Response 
} from "express"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    /**
   * Ghi access log sớm ở đầu request để quan sát traffic realtime
   * (EN: log request access early to observe realtime traffic).
   *
   * @param req - HTTP request hiện tại (EN: current HTTP request).
   * @param _res - HTTP response (không dùng trong middleware này) (EN: HTTP response, unused here).
   * @param next - Hàm chuyển middleware tiếp theo (EN: callback to next middleware).
   * @returns void - Không trả dữ liệu (EN: no return value).
   * @sideEffects Ghi log ra stdout để debug pipeline nhanh
   * (EN: writes log to stdout for quick pipeline debugging).
   */
    use(req: Request, _res: Response, next: NextFunction) {
        const requestId = req.header("x-request-id")
        // Log đủ method + path + request-id để truy vết theo từng request cụ thể
        // (EN: include method + path + request-id for per-request traceability).
        console.log(
            `[LoggerMiddleware] ${req.method} ${req.originalUrl} requestId=${requestId ?? "n/a"}`,
        )
        next()
    }
}
