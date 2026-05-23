/**
 * Service gốc — trả lời mặc định cho health check.
 * (EN: Root service — default response for health check.)
 */
import {
    Injectable,
} from "@nestjs/common"

@Injectable()
export class AppService {
    /**
     * Trả chuỗi "Hello World!" cho endpoint gốc.
     * (EN: Return "Hello World!" string for root endpoint.)
     */
    getHello(): string {
        return "Hello World!"
    }
}
