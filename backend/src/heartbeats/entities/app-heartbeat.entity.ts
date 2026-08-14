import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('app_heartbeats')
@Index(['app_name'])
@Index(['timestamp'])
export class AppHeartbeat {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  app_name: string;

  @Column({ type: 'varchar', length: 36 })
  execution_id: string;

  @Column({ type: 'datetime', precision: 6 })
  timestamp: Date;

  @Column({ type: 'int' })
  ttl_seconds: number;
}
