/**
 * Pipe validate và transform `id` path param thành số nguyên dương.
 * (EN: Pipe validating and transforming `id` path param into a positive integer.)
 */
import {
    BadRequestException,
    Injectable,
    PipeTransform,
} from "@nestjs/common"

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
    /**
     * Validate và transform path param `id` thành số nguyên dương.
     * (EN: Validate and transform `id` path param into a positive integer.)
     */
    transform(value: string): number {
        // Ép kiểu rõ ràng để kiểm soát validation thay vì để implicit conversion ở business layer.
        // (EN: Cast explicitly to control validation instead of relying on business-layer conversion.)
        const parsed = Number(value)
        // Chặn fail-fast tại boundary để controller/service chỉ nhận dữ liệu sạch.
        // (EN: Fail fast at boundary so controller/service only receives valid input.)
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new BadRequestException("id must be a positive integer")
        }

        return parsed
    }
}
