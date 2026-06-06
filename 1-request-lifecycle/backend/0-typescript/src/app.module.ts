/**
 * Root module — aggregates ItemsModule + registers global middleware/guard/interceptor.
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
     * Register global middlewares so every request has request-id and access log.
     */
    configure(consumer: MiddlewareConsumer): void {
        // Middleware order is critical: request-id must run first so logger always has correlation key.
        consumer.apply(RequestIdMiddleware,
            LoggerMiddleware).forRoutes("*")
    }
}
