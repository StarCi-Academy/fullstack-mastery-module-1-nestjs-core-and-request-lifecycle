/**
 * Module gốc — gom ItemsModule + đăng ký middleware/guard/interceptor toàn cục.
 * (EN: Root module — aggregates ItemsModule + registers global middleware/guard/interceptor.)
 */
import {
    MiddlewareConsumer,
    Module,
    NestModule,
} from "@nestjs/common"
import {
    APP_GUARD,
    APP_INTERCEPTOR,
} from "@nestjs/core"
import {
    ItemsModule,
} from "./items"
import {
    RequestIdMiddleware,
    LoggerMiddleware,
    TimingGuard,
    ExecutionTimerInterceptor,
    ResponseTransformInterceptor,
} from "./common"

@Module({
    imports: [ItemsModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: TimingGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseTransformInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ExecutionTimerInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    /**
     * Đăng ký middleware toàn cục để request luôn có request-id và access log.
     * (EN: Register global middlewares so every request has request-id and access log.)
     */
    configure(consumer: MiddlewareConsumer): void {
        // Thứ tự middleware rất quan trọng: cần request-id trước để logger luôn có correlation key.
        // (EN: Middleware order is critical: request-id must run first so logger always has correlation key.)
        consumer.apply(RequestIdMiddleware,
            LoggerMiddleware).forRoutes("*")
    }
}
