/**
 * Global error convergence point — normalizes every exception into one consistent error envelope.
 */
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from "@nestjs/common"
import {
    Request,
    Response,
} from "express"

/**
 * Map an HTTP status to a standard reason phrase so the `error` field always matches the code.
 */
function humanReason(status: number): string {
    if (status === 400) return "Bad Request"
    if (status === 404) return "Not Found"
    return "Internal Server Error"
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name)

    /**
     * Catch every exception, classify expected vs unexpected, return a standard envelope and hide the stack on the way out.
     */
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()
        const res = ctx.getResponse<Response>()
        const req = ctx.getRequest<Request>()

        const isHttp = exception instanceof HttpException
        const status = isHttp ? exception.getStatus() : 500
        // Expected error: use the domain's safe message. Unexpected error: mask with a generic message.
        const message = isHttp
            ? (exception.getResponse() as { message?: string }).message ?? exception.message
            : "Internal server error"

        if (!isHttp) {
            // The stack trace is logged internally ONLY, never returned to the client.
            this.logger.error(`Unhandled ${req.method} ${req.url}`,
                (exception as Error).stack)
        }

        res.status(status).json({
            statusCode: status,
            error: humanReason(status),
            message,
            timestamp: new Date().toISOString(),
            path: req.url,
        })
    }
}
