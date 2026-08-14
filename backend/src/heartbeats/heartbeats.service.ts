import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppHeartbeat } from './entities/app-heartbeat.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class HeartbeatsService {
  constructor(
    @InjectRepository(AppHeartbeat)
    private readonly heartbeatRepository: Repository<AppHeartbeat>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<AppHeartbeat>> {
    const { page = 1, limit = 20, app_name } = paginationQuery;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (app_name) {
      where.app_name = app_name;
    }

    const [data, total] = await this.heartbeatRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        timestamp: 'DESC',
      },
    });

    return new PaginatedResponseDto<AppHeartbeat>(data, total, page, limit);
  }
}
