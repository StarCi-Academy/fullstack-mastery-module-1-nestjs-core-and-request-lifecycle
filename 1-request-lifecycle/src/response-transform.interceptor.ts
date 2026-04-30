import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common"
import {
    map, Observable 
} from "rxjs"

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    /**
   * Chuẩn hóa shape response để frontend nhận contract thống nhất giữa mọi endpoint
   * (EN: standardize response shape so frontend gets a consistent contract across endpoints).
   *
   * @param context - Execution context chứa request hiện tại (EN: execution context with current request).
   * @param next - Handler phần còn lại của pipeline (EN: handler for the remaining pipeline).
   * @returns Observable<unknown> - Stream response đã bọc metadata
   * (EN: response stream wrapped with metadata).
   * @sideEffects Không ghi external state, chỉ biến đổi payload trả về
   * (EN: no external state mutation, only transforms outgoing payload).
   */
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const req = context.switchToHttp().getRequest()

        return next.handle().pipe(
            // Bọc metadata ở một nơi duy nhất để tránh duplicated logic ở từng controller
            // (EN: wrap metadata in one place to avoid duplicated logic in each controller).
            map((data) => ({
                data,
                timestamp: new Date().toISOString(),
                requestId: req.header("x-request-id") ?? null,
                executionMs: req.executionMs ?? null,
            })),
        )
    }
}
