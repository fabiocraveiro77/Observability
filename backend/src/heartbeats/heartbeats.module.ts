import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartbeatsService } from './heartbeats.service';
import { HeartbeatsController } from './heartbeats.controller';
import { AppHeartbeat } from './entities/app-heartbeat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppHeartbeat])],
  providers: [HeartbeatsService],
  controllers: [HeartbeatsController]
})
export class HeartbeatsModule {}
