import {
    CanActivate, ExecutionContext, Injectable 
} from "@nestjs/common"

@Injectable()
export class TimingGuard implements CanActivate {
    /**
   * Đánh dấu timestamp khi request vừa đi qua guard để phục vụ đo thời gian end-to-end
   * (EN: mark timestamp when request enters guard for end-to-end timing metrics).
   *
   * @param context - Execution context hiện tại (EN: current execution context).
   * @returns boolean - `true` để tiếp tục pipeline (EN: `true` to continue pipeline).
   * @sideEffects Ghi `guardEnterAt` vào object request
   * (EN: writes `guardEnterAt` value into request object).
   */
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest()
        // Ghi mốc thời gian sớm để so sánh với execution time trong interceptor
        // (EN: record early timestamp to compare with execution time in interceptor).
        req.guardEnterAt = Date.now()
        return true
    }
}
