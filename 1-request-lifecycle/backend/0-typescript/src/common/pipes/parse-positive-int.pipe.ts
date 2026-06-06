/**
 * Pipe validating and transforming `id` path param into a positive integer.
 */
import {
    BadRequestException,
    Injectable,
    PipeTransform,
} from "@nestjs/common"

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
    /**
     * Validate and transform `id` path param into a positive integer.
     */
    transform(value: string): number {
        // Cast explicitly to control validation instead of relying on business-layer conversion.
        const parsed = Number(value)
        // Fail fast at boundary so controller/service only receives valid input.
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new BadRequestException("id must be a positive integer")
        }

        return parsed
    }
}
