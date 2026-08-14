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

  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<ObservabilityEvent>> {
    const { 
      page = 1, limit = 20, app_name, status, partner_name, transaction_id, trace_id, search 
    } = paginationQuery;
    
    const skip = (page - 1) * limit;
    
    const qb = this.eventRepository.createQueryBuilder('event').where('1=1');

    if (app_name) qb.andWhere('event.app_name = :app_name', { app_name });
    if (status) qb.andWhere('event.status = :status', { status });
    if (partner_name) qb.andWhere('event.partner_name = :partner_name', { partner_name });
    if (transaction_id) qb.andWhere('event.transaction_id = :transaction_id', { transaction_id });
    if (trace_id) qb.andWhere('event.trace_id = :trace_id', { trace_id });
    
    if (search) {
      qb.andWhere(
        new Brackets((sqb) => {
          sqb.where('event.internal_reference LIKE :search', { search: `%${search}%` })
             .orWhere('event.external_reference LIKE :search', { search: `%${search}%` })
             .orWhere('event.action_code LIKE :search', { search: `%${search}%` })
             .orWhere('event.transaction_id LIKE :search', { search: `%${search}%` })
             .orWhere('event.trace_id LIKE :search', { search: `%${search}%` });
        })
      );
    }

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

  async getStats(): Promise<any> {
    const qb = this.eventRepository.createQueryBuilder('event');
    
    const totalEvents = await qb.getCount();
    
    const successEvents = await this.eventRepository.createQueryBuilder('event')
      .where('event.status = :status', { status: 'SUCCESS' })
      .getCount();
      
    const errorStatuses = ['HTTP_ERROR', 'BUSINESS_ERROR', 'VALIDATION_FAILED', 'EXCEPTION', 'TIMEOUT'];
    const errorEvents = await this.eventRepository.createQueryBuilder('event')
      .where('event.status IN (:...statuses)', { statuses: errorStatuses })
      .getCount();

    const pendingEvents = await this.eventRepository.createQueryBuilder('event')
      .where('event.status = :status', { status: 'PENDING' })
      .getCount();

    return {
      total: totalEvents,
      success: successEvents,
      error: errorEvents,
      pendings: pendingEvents,
    };
  }
}
