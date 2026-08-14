"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const heartbeats_service_1 = require("./heartbeats.service");
const heartbeats_controller_1 = require("./heartbeats.controller");
const app_heartbeat_entity_1 = require("./entities/app-heartbeat.entity");
let HeartbeatsModule = class HeartbeatsModule {
};
exports.HeartbeatsModule = HeartbeatsModule;
exports.HeartbeatsModule = HeartbeatsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([app_heartbeat_entity_1.AppHeartbeat])],
        providers: [heartbeats_service_1.HeartbeatsService],
        controllers: [heartbeats_controller_1.HeartbeatsController]
    })
], HeartbeatsModule);
//# sourceMappingURL=heartbeats.module.js.map