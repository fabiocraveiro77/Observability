import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ObservabilityModule } from './observability/observability.module';
import { HeartbeatsModule } from './heartbeats/heartbeats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ObservabilityModule,
    HeartbeatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
