/**
 * Interceptor standardizing response shape — frontend gets consistent contract.
 */
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common"
import {
    map,
    Observable,
} from "rxjs"

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    /**
     * Standardize response shape so frontend gets a consistent contract across endpoints.
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const req = context.switchToHttp().getRequest()

        return next.handle().pipe(
            // Wrap metadata in one place to avoid duplicated logic in each controller.
            map((data) => ({
                data,
                timestamp: new Date().toISOString(),
                requestId: req.header("x-request-id") ?? null,
                executionMs: req.executionMs ?? null,
            })),
        )
    }
}
