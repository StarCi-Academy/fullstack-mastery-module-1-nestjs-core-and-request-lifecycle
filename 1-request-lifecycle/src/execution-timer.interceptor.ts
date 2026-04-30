import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common"
import {
    Observable, tap 
} from "rxjs"

@Injectable()
export class ExecutionTimerInterceptor implements NestInterceptor {
    /**
   * Đo thời gian xử lý route và gắn kết quả vào request cho interceptor downstream dùng lại
   * (EN: measure route execution time and attach result to request for downstream usage).
   *
   * @param context - Execution context chứa HTTP request (EN: execution context containing HTTP request).
   * @param next - Handler đại diện cho phần còn lại của pipeline (EN: handler for remaining pipeline).
   * @returns Observable<unknown> - Stream response đã được tap metric
   * (EN: response stream with timing side-effect).
   * @sideEffects Ghi `executionMs` lên request object
   * (EN: writes `executionMs` onto request object).
   */
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const req = context.switchToHttp().getRequest()
        const start = Date.now()

        return next.handle().pipe(
            tap(() => {
                // Tính thời gian sau khi handler hoàn tất để phản ánh chi phí xử lý thực tế
                // (EN: compute duration after handler completes to reflect actual processing cost).
                const tookMs = Date.now() - start
                req.executionMs = tookMs
            }),
        )
    }
}
