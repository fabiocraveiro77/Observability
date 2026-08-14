import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservabilityService } from './observability.service';
import { ObservabilityController } from './observability.controller';
import { ObservabilityEvent } from './entities/observability-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ObservabilityEvent])],
  providers: [ObservabilityService],
  controllers: [ObservabilityController]
})
export class ObservabilityModule {}
