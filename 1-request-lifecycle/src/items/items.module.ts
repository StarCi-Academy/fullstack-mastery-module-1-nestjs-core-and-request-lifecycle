/**
 * ItemsModule — đăng ký controller + service cho feature items.
 * (EN: ItemsModule — registers controller + service for items feature.)
 */
import {
    Module,
} from "@nestjs/common"
import {
    ItemsController,
} from "./items.controller"
import {
    ItemsService,
} from "./items.service"

@Module({
    controllers: [ItemsController],
    providers: [ItemsService],
})
export class ItemsModule { }
