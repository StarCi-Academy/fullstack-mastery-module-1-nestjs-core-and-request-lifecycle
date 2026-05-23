/**
 * Service xử lý dữ liệu mèo — cung cấp demo data và cross-module hint.
 * (EN: Service handling cat data — provides demo data and cross-module hint.)
 */
import {
    Injectable,
} from "@nestjs/common"

@Injectable()
export class CatService {
    /**
     * Dataset mẫu dùng chung cho mọi method để tránh trùng dữ liệu.
     * (EN: Shared sample dataset used by all methods to avoid duplication.)
     */
    private readonly cats: Array<{ id: number; name: string }> = [
        {
            id: 1, name: "Milo"
        },
        {
            id: 2, name: "Luna"
        },
    ]

    /**
     * Trả về danh sách mèo mẫu để smoke test endpoint `/cats`.
     * (EN: Return sample cat list for `/cats` smoke test.)
     */
    getCats(): Array<{ id: number; name: string }> {
        // Dùng dữ liệu cố định để bài DI tập trung vào module boundary thay vì DB setup.
        // (EN: Use static data so DI lesson focuses on module boundaries instead of DB setup.)
        return this.cats
    }

    /**
     * Trả về một mèo theo id — minh hoạ path param + service findById.
     * (EN: Return one cat by id — demonstrates path param + service findById.)
     */
    findById(id: number): { id: number; name: string } | undefined {
        // Lookup tuyến tính chấp nhận được vì dataset cố định nhỏ; bài học tập trung DI chứ không phải DB.
        // (EN: Linear lookup is acceptable for the small static dataset; the lesson focuses on DI, not DB.)
        return this.cats.find((cat) => cat.id === id)
    }

    /**
     * Cung cấp tín hiệu phụ thuộc cho `DogService` để chứng minh cross-module injection.
     * (EN: Provide dependency signal for `DogService` to prove cross-module injection.)
     */
    getSpyHint(): string {
        return "cat-network-ready"
    }
}
