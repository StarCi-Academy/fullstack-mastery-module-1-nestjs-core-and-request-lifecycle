/**
 * Guard đánh dấu timestamp khi request vào — phục vụ đo thời gian end-to-end.
 * (EN: Guard marking timestamp when request enters — for end-to-end timing metrics.)
 */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from "@nestjs/common"

@Injectable()
export class TimingGuard implements CanActivate {
    /**
     * Đánh dấu timestamp khi request vừa đi qua guard.
     * (EN: Mark timestamp when request enters guard for end-to-end timing metrics.)
     */
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest()
        // Ghi mốc thời gian sớm để so sánh với execution time trong interceptor.
        // (EN: Record early timestamp to compare with execution time in interceptor.)
        req.guardEnterAt = Date.now()
        return true
    }
}
