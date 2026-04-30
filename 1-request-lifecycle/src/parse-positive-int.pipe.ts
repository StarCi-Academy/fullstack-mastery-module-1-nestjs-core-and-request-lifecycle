import {
    BadRequestException, Injectable, PipeTransform 
} from "@nestjs/common"

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
    /**
   * Validate và transform path param `id` thành số nguyên dương
   * (EN: validate and transform `id` path param into a positive integer).
   *
   * @param value - Giá trị `id` dạng string từ HTTP path (EN: `id` string value from HTTP path).
   * @returns number - Giá trị số nguyên dương đã parse (EN: parsed positive integer value).
   * @sideEffects Ném `BadRequestException` khi input không hợp lệ
   * (EN: throws `BadRequestException` when input is invalid).
   */
    transform(value: string): number {
    // Ép kiểu rõ ràng để kiểm soát validation thay vì để implicit conversion ở business layer
    // (EN: cast explicitly to control validation instead of relying on business-layer conversion).
        const parsed = Number(value)
        // Chặn fail-fast tại boundary để controller/service chỉ nhận dữ liệu sạch
        // (EN: fail fast at boundary so controller/service only receives valid input).
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new BadRequestException("id must be a positive integer")
        }

        return parsed
    }
}
