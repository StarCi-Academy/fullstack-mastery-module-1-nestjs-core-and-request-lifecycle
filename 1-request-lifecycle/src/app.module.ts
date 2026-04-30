import {
    MiddlewareConsumer, Module, NestModule 
} from "@nestjs/common"
import {
    APP_GUARD, APP_INTERCEPTOR 
} from "@nestjs/core"
import {
    ItemsController 
} from "./items.controller"
import {
    ItemsService 
} from "./items.service"
import {
    TimingGuard 
} from "./timing.guard"
import {
    ExecutionTimerInterceptor 
} from "./execution-timer.interceptor"
import {
    ResponseTransformInterceptor 
} from "./response-transform.interceptor"
import {
    LoggerMiddleware 
} from "./logger.middleware"
import {
    RequestIdMiddleware 
} from "./request-id.middleware"

@Module({
    controllers: [ItemsController],
    providers: [
        ItemsService,
        {
            provide: APP_GUARD, useClass: TimingGuard 
        },
        {
            provide: APP_INTERCEPTOR, useClass: ExecutionTimerInterceptor 
        },
        {
            provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor 
        },
    ],
})
export class AppModule implements NestModule {
    /**
   * Đăng ký middleware toàn cục để request luôn có request-id và access log
   * (EN: register global middlewares so every request has request-id and access log).
   *
   * @param consumer - Middleware consumer của Nest (EN: Nest middleware consumer).
   * @returns void - Không trả giá trị (EN: no return value).
   * @sideEffects Gắn `RequestIdMiddleware` và `LoggerMiddleware` cho mọi route
   * (EN: applies `RequestIdMiddleware` and `LoggerMiddleware` to all routes).
   */
    configure(consumer: MiddlewareConsumer) {
    // Thứ tự middleware rất quan trọng: cần request-id trước để logger luôn có correlation key
    // (EN: middleware order is critical: request-id must run first so logger always has correlation key).
        consumer.apply(RequestIdMiddleware,
            LoggerMiddleware).forRoutes("*")
    }
}
