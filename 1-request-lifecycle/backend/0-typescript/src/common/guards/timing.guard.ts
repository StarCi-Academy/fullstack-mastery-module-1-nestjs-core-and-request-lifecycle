/**
 * Guard marking timestamp when request enters — for end-to-end timing metrics.
 */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from "@nestjs/common"

@Injectable()
export class TimingGuard implements CanActivate {
    /**
     * Mark timestamp when request enters guard for end-to-end timing metrics.
     */
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest()
        // Record early timestamp to compare with execution time in interceptor.
        req.guardEnterAt = Date.now()
        return true
    }
}
