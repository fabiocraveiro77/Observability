"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const observability_event_entity_1 = require("./entities/observability-event.entity");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
let ObservabilityService = class ObservabilityService {
    eventRepository;
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 20, app_name, status, partner_name, transaction_id, trace_id, search } = paginationQuery;
        const skip = (page - 1) * limit;
        const qb = this.eventRepository.createQueryBuilder('event').where('1=1');
        if (app_name)
            qb.andWhere('event.app_name = :app_name', { app_name });
        if (status)
            qb.andWhere('event.status = :status', { status });
        if (partner_name)
            qb.andWhere('event.partner_name = :partner_name', { partner_name });
        if (transaction_id)
            qb.andWhere('event.transaction_id = :transaction_id', { transaction_id });
        if (trace_id)
            qb.andWhere('event.trace_id = :trace_id', { trace_id });
        if (search) {
            qb.andWhere(new typeorm_2.Brackets((sqb) => {
                sqb.where('event.internal_reference LIKE :search', { search: `%${search}%` })
                    .orWhere('event.external_reference LIKE :search', { search: `%${search}%` })
                    .orWhere('event.action_code LIKE :search', { search: `%${search}%` })
                    .orWhere('event.transaction_id LIKE :search', { search: `%${search}%` })
                    .orWhere('event.trace_id LIKE :search', { search: `%${search}%` });
            }));
        }
        qb.orderBy('event.timestamp', 'DESC');
        qb.skip(skip).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return new paginated_response_dto_1.PaginatedResponseDto(data, total, page, limit);
    }
    async getApps() {
        const result = await this.eventRepository
            .createQueryBuilder('event')
            .select('DISTINCT(event.app_name)', 'app_name')
            .where('event.app_name IS NOT NULL')
            .getRawMany();
        return result.map(r => r.app_name);
    }
    async getStats() {
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
};
exports.ObservabilityService = ObservabilityService;
exports.ObservabilityService = ObservabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(observability_event_entity_1.ObservabilityEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ObservabilityService);
//# sourceMappingURL=observability.service.js.map