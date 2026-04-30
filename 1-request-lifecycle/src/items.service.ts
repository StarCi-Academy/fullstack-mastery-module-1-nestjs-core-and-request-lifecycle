import {
    Injectable 
} from "@nestjs/common"

@Injectable()
export class ItemsService {
    /**
   * Trả danh sách item mẫu cho endpoint list trong bài request lifecycle
   * (EN: return sample item list for request-lifecycle lesson list endpoint).
   *
   * @returns Array<{ id: number; name: string }> - Danh sách item demo (EN: demo item list).
   */
    findAll() {
    // Trả dữ liệu in-memory để bài học tập trung vào pipeline, không phụ thuộc DB
    // (EN: return in-memory data so the lesson focuses on pipeline instead of DB setup).
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
   * Trả chi tiết item theo id đã qua pipe validation
   * (EN: return item detail by id that has passed pipe validation).
   *
   * @param id - ID item đã được xác thực (EN: validated item identifier).
   */
    findOne(id: number) {
        return {
            id, name: `item-${id}` 
        }
    }
}
