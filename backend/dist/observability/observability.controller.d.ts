import { ObservabilityService } from './observability.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { ObservabilityEvent } from './entities/observability-event.entity';
export declare class ObservabilityController {
    private readonly observabilityService;
    constructor(observabilityService: ObservabilityService);
    getApps(): Promise<string[]>;
    getStats(): Promise<any>;
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<ObservabilityEvent>>;
}
