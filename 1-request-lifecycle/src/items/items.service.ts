/**
 * Service xử lý dữ liệu item — in-memory data cho demo lifecycle.
 * (EN: Service handling item data — in-memory data for lifecycle demo.)
 */
import {
    Injectable,
} from "@nestjs/common"

@Injectable()
export class ItemsService {
    /**
     * Trả danh sách item mẫu cho endpoint list.
     * (EN: Return sample item list for list endpoint.)
     */
    findAll() {
        // Trả dữ liệu in-memory để bài học tập trung vào pipeline, không phụ thuộc DB.
        // (EN: Return in-memory data so the lesson focuses on pipeline instead of DB setup.)
        return [
            {
                id: 1, name: "keyboard" 
            },
            {
                id: 2, name: "mouse" 
            },
        ]
    }

    /**
     * Trả chi tiết item theo id đã qua pipe validation.
     * (EN: Return item detail by id that has passed pipe validation.)
     */
    findOne(id: number) {
        return {
            id, name: `item-${id}` 
        }
    }
}
