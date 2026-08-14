import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { ObservabilityEvent } from './entities/observability-event.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class ObservabilityService {
  constructor(
    @InjectRepository(ObservabilityEvent)
    private readonly eventRepository: Repository<ObservabilityEvent>,
  ) {}

  private applyFilters(qb: any, query: PaginationQueryDto) {
    const { app_name, status, partner_name, transaction_id, trace_id, search, startDate, endDate } = query;

    if (app_name) qb.andWhere('event.app_name = :app_name', { app_name });
    if (status) qb.andWhere('event.status = :status', { status });
    if (partner_name) qb.andWhere('event.partner_name = :partner_name', { partner_name });
    if (transaction_id) qb.andWhere('event.transaction_id = :transaction_id', { transaction_id });
    if (trace_id) qb.andWhere('event.trace_id = :trace_id', { trace_id });
    if (startDate) qb.andWhere('event.timestamp >= :startDate', { startDate: new Date(startDate) });
    if (endDate) qb.andWhere('event.timestamp <= :endDate', { endDate: new Date(endDate) });
    
    if (search) {
      qb.andWhere(
        new Brackets((sqb: any) => {
          sqb.where('event.internal_reference LIKE :search', { search: `%${search}%` })
             .orWhere('event.external_reference LIKE :search', { search: `%${search}%` })
             .orWhere('event.action_code LIKE :search', { search: `%${search}%` })
             .orWhere('event.transaction_id LIKE :search', { search: `%${search}%` })
             .orWhere('event.trace_id LIKE :search', { search: `%${search}%` });
        })
      );
    }
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<ObservabilityEvent>> {
    const { page = 1, limit = 20 } = paginationQuery;
    
    const skip = (page - 1) * limit;
    
    const qb = this.eventRepository.createQueryBuilder('event').where('1=1');
    this.applyFilters(qb, paginationQuery);

    qb.orderBy('event.timestamp', 'DESC');
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return new PaginatedResponseDto<ObservabilityEvent>(data, total, page, limit);
  }

  async getApps(): Promise<string[]> {
    const result = await this.eventRepository
      .createQueryBuilder('event')
      .select('DISTINCT(event.app_name)', 'app_name')
      .where('event.app_name IS NOT NULL')
      .getRawMany();
    
    return result.map(r => r.app_name);
  }

  async getStats(query: PaginationQueryDto = {}): Promise<any> {
    const baseQb = () => {
      const qb = this.eventRepository.createQueryBuilder('event').where('1=1');
      this.applyFilters(qb, query);
      return qb;
    };
    
    const totalEvents = await baseQb().getCount();
    
    const successEvents = await baseQb()
      .andWhere('event.status = :successStatus', { successStatus: 'SUCCESS' })
      .getCount();
      
    const errorStatuses = ['HTTP_ERROR', 'BUSINESS_ERROR', 'VALIDATION_FAILED', 'EXCEPTION', 'TIMEOUT'];
    const errorEvents = await baseQb()
      .andWhere('event.status IN (:...errorStatuses)', { errorStatuses })
      .getCount();

    const pendingEvents = await baseQb()
      .andWhere('event.status = :pendingStatus', { pendingStatus: 'PENDING' })
      .getCount();

    return {
      total: totalEvents,
      success: successEvents,
      error: errorEvents,
      pendings: pendingEvents,
    };
  }
}
