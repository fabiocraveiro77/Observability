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
exports.HeartbeatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_heartbeat_entity_1 = require("./entities/app-heartbeat.entity");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
let HeartbeatsService = class HeartbeatsService {
    heartbeatRepository;
    constructor(heartbeatRepository) {
        this.heartbeatRepository = heartbeatRepository;
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 20, app_name } = paginationQuery;
        const skip = (page - 1) * limit;
        const where = {};
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
        return new paginated_response_dto_1.PaginatedResponseDto(data, total, page, limit);
    }
};
exports.HeartbeatsService = HeartbeatsService;
exports.HeartbeatsService = HeartbeatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(app_heartbeat_entity_1.AppHeartbeat)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HeartbeatsService);
//# sourceMappingURL=heartbeats.service.js.map