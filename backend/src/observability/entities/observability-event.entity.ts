import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('observability_events')
@Index(['transaction_id'])
@Index(['execution_id'])
@Index(['app_name'])
@Index(['timestamp'])
export class ObservabilityEvent {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'datetime', precision: 6 })
  timestamp: Date;

  @Column({ type: 'varchar', length: 100 })
  app_name: string;

  @Column({ type: 'varchar', length: 36 })
  execution_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transaction_id: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  trace_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  partner_name: string;

  @Column({ type: 'int', nullable: true })
  step_current: number;

  @Column({ type: 'int', nullable: true })
  step_total: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  action_code: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'json', nullable: true })
  payload_data: any;

  @Column({ type: 'json', nullable: true })
  payload_type: any;

  @Column({ type: 'json', nullable: true })
  request_data: any;

  @Column({ type: 'json', nullable: true })
  response_data: any;

  @Column({ type: 'longtext', nullable: true })
  error_stacktrace: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  internal_reference: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  external_reference: string;
}
