import { Controller, Get, Query } from '@nestjs/common';
import { HeartbeatsService } from './heartbeats.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { AppHeartbeat } from './entities/app-heartbeat.entity';

@Controller('heartbeats')
export class HeartbeatsController {
  constructor(private readonly heartbeatsService: HeartbeatsService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<AppHeartbeat>> {
    return this.heartbeatsService.findAll(paginationQuery);
  }
}
