import { Repository } from 'typeorm';
import { ObservabilityEvent } from './entities/observability-event.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
export declare class ObservabilityService {
    private readonly eventRepository;
    constructor(eventRepository: Repository<ObservabilityEvent>);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<ObservabilityEvent>>;
    getApps(): Promise<string[]>;
    getStats(): Promise<any>;
}
