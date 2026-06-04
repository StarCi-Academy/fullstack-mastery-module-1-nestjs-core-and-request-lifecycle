/**
 * Root service — default response for health check.
 */
import {
    Injectable,
} from "@nestjs/common"

@Injectable()
export class AppService {
    /**
     * Return "Hello World!" string for root endpoint.
     */
    getHello(): string {
        return "Hello World!"
    }
}
