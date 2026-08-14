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
exports.ObservabilityController = void 0;
const common_1 = require("@nestjs/common");
const observability_service_1 = require("./observability.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
let ObservabilityController = class ObservabilityController {
    observabilityService;
    constructor(observabilityService) {
        this.observabilityService = observabilityService;
    }
    async getApps() {
        return this.observabilityService.getApps();
    }
    async getStats(query) {
        return this.observabilityService.getStats(query);
    }
    async findAll(paginationQuery) {
        return this.observabilityService.findAll(paginationQuery);
    }
};
exports.ObservabilityController = ObservabilityController;
__decorate([
    (0, common_1.Get)('apps'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ObservabilityController.prototype, "getApps", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], ObservabilityController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], ObservabilityController.prototype, "findAll", null);
exports.ObservabilityController = ObservabilityController = __decorate([
    (0, common_1.Controller)('observability'),
    __metadata("design:paramtypes", [observability_service_1.ObservabilityService])
], ObservabilityController);
//# sourceMappingURL=observability.controller.js.map