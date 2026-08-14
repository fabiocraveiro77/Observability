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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityEvent = void 0;
const typeorm_1 = require("typeorm");
let ObservabilityEvent = class ObservabilityEvent {
    id;
    timestamp;
    app_name;
    execution_id;
    transaction_id;
    trace_id;
    partner_name;
    step_current;
    step_total;
    action_code;
    status;
    payload_data;
    payload_type;
    request_data;
    response_data;
    error_stacktrace;
    internal_reference;
    external_reference;
};
exports.ObservabilityEvent = ObservabilityEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], ObservabilityEvent.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "app_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "execution_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36, nullable: true }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "trace_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "partner_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ObservabilityEvent.prototype, "step_current", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ObservabilityEvent.prototype, "step_total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "action_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ObservabilityEvent.prototype, "payload_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ObservabilityEvent.prototype, "payload_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ObservabilityEvent.prototype, "request_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ObservabilityEvent.prototype, "response_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "error_stacktrace", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "internal_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ObservabilityEvent.prototype, "external_reference", void 0);
exports.ObservabilityEvent = ObservabilityEvent = __decorate([
    (0, typeorm_1.Entity)('observability_events'),
    (0, typeorm_1.Index)(['transaction_id']),
    (0, typeorm_1.Index)(['execution_id']),
    (0, typeorm_1.Index)(['app_name']),
    (0, typeorm_1.Index)(['timestamp'])
], ObservabilityEvent);
//# sourceMappingURL=observability-event.entity.js.map