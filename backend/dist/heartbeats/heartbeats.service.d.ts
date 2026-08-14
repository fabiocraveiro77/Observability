import { Repository } from 'typeorm';
import { AppHeartbeat } from './entities/app-heartbeat.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
export declare class HeartbeatsService {
    private readonly heartbeatRepository;
    constructor(heartbeatRepository: Repository<AppHeartbeat>);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<AppHeartbeat>>;
}
