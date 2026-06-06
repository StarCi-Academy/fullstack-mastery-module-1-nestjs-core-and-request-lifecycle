/**
 * Root module — aggregates ItemsModule + registers the global error convergence point (APP_FILTER).
 */
import {
    Module,
} from "@nestjs/common"
import {
    APP_FILTER,
} from "@nestjs/core"
import {
    ItemsModule,
} from "./items"
import {
    AllExceptionsFilter,
} from "./common"

@Module({
    imports: [ItemsModule],
    providers: [
        // Register AllExceptionsFilter via APP_FILTER → every exception from any layer
        // converges to a single filter, so the envelope is defined exactly once.)
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule { }
