/**
 * Interceptor measuring route execution time — attaches `executionMs` to request.
 */
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common"
import {
    Observable,
    tap,
} from "rxjs"

@Injectable()
export class ExecutionTimerInterceptor implements NestInterceptor {
    /**
     * Measure route execution time and attach result to request for downstream usage.
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const req = context.switchToHttp().getRequest()
        const start = Date.now()

        return next.handle().pipe(
            tap(() => {
                // Compute duration after handler completes to reflect actual processing cost.
                const tookMs = Date.now() - start
                req.executionMs = tookMs
            }),
        )
    }
}
