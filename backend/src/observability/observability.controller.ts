import { Controller, Get, Query } from '@nestjs/common';
import { ObservabilityService } from './observability.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { ObservabilityEvent } from './entities/observability-event.entity';

@Controller('observability')
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Get('apps')
  async getApps(): Promise<string[]> {
    return this.observabilityService.getApps();
  }

  @Get('stats')
  async getStats(): Promise<any> {
    return this.observabilityService.getStats();
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<ObservabilityEvent>> {
    return this.observabilityService.findAll(paginationQuery);
  }
}
