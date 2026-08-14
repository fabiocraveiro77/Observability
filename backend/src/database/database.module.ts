import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ObservabilityEvent } from '../observability/entities/observability-event.entity';
import { AppHeartbeat } from '../heartbeats/entities/app-heartbeat.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'root'),
        database: configService.get<string>('DB_DATABASE', 'observability_db'),
        entities: [ObservabilityEvent, AppHeartbeat],
        synchronize: true, // Use false in real production, but useful for dev
        logging: ['warn', 'error'],
      }),
    }),
  ],
})
export class DatabaseModule {}
