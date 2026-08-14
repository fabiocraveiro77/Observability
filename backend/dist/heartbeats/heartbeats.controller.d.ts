import { HeartbeatsService } from './heartbeats.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { AppHeartbeat } from './entities/app-heartbeat.entity';
export declare class HeartbeatsController {
    private readonly heartbeatsService;
    constructor(heartbeatsService: HeartbeatsService);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<AppHeartbeat>>;
}
