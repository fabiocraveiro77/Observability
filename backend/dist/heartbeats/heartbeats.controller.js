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
exports.HeartbeatsController = void 0;
const common_1 = require("@nestjs/common");
const heartbeats_service_1 = require("./heartbeats.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
let HeartbeatsController = class HeartbeatsController {
    heartbeatsService;
    constructor(heartbeatsService) {
        this.heartbeatsService = heartbeatsService;
    }
    async findAll(paginationQuery) {
        return this.heartbeatsService.findAll(paginationQuery);
    }
};
exports.HeartbeatsController = HeartbeatsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], HeartbeatsController.prototype, "findAll", null);
exports.HeartbeatsController = HeartbeatsController = __decorate([
    (0, common_1.Controller)('heartbeats'),
    __metadata("design:paramtypes", [heartbeats_service_1.HeartbeatsService])
], HeartbeatsController);
//# sourceMappingURL=heartbeats.controller.js.map