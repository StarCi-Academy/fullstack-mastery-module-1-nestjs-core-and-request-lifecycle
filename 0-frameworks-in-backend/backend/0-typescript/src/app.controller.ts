/**
 * Root controller — default health endpoint.
 */
import {
    Controller,
    Get,
} from "@nestjs/common"
import {
    AppService,
} from "./app.service"

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    /**
     * Handle `GET /` default response.
     */
    @Get()
    getHello(): string {
        return this.appService.getHello()
    }
}
