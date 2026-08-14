import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ObservabilityService, ObservabilityEvent } from '../../core/services/observability.service';
import { JsonViewerComponent } from '../json-viewer/json-viewer.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, JsonViewerComponent],
  template: `
    <div class="page-header">
      <div>
        <a routerLink="/" class="back-link">
          <span class="material-symbols-outlined">arrow_back</span>
          Voltar para o Dashboard
        </a>
        <h1 class="page-title mt-3">Rastreamento de Transação</h1>
        <p class="page-subtitle">Histórico de eventos para o Transaction ID <strong class="text-primary">#{{ transactionId() }}</strong></p>
      </div>
      <button class="btn btn-outline shadow-sm" (click)="fetchData()" [disabled]="loading()">
        <span class="material-symbols-outlined icon-left">refresh</span>
        {{ loading() ? 'Sincronizando...' : 'Atualizar Dados' }}
      </button>
    </div>

    <!-- Timeline Wrapper -->
    <div class="timeline-container" *ngIf="!loading()">
      <ng-container *ngIf="events().length > 0; else emptyState">
        <div class="timeline">
          <div class="timeline-item" *ngFor="let ev of events()">
            <div class="timeline-marker bg-{{ getSeverity(ev.status) }}">
              <span class="material-symbols-outlined">{{ getIcon(ev.status) }}</span>
            </div>
            <div class="timeline-content card">
              <div class="timeline-header">
                <div class="header-main">
                  <span class="tag tag-{{ getSeverity(ev.status) }}">{{ ev.status }}</span>
                  <span class="partner-info">
                    <span class="material-symbols-outlined">storefront</span>
                    {{ ev.partner_name || 'N/A' }}
                  </span>
                  <span class="step-info">
                    Passo {{ ev.step_current || 'N/A' }} de {{ ev.step_total || 'N/A' }}
                  </span>
                </div>
                <span class="timeline-date">
                  <span class="material-symbols-outlined">schedule</span>
                  {{ ev.timestamp | date:'dd/MM/yyyy HH:mm:ss.SSS' }}
                </span>
              </div>
              
              <div class="timeline-body">
                <div class="metadata">
                  <p><strong>App:</strong> {{ ev.app_name }}</p>
                  <p><strong>Ação:</strong> {{ ev.action_code }}</p>
                  <p><strong>Trace ID:</strong> {{ ev.trace_id || 'N/A' }}</p>
                  <p><strong>Exec ID:</strong> {{ ev.execution_id || 'N/A' }}</p>
                  <p><strong>Passo:</strong> {{ ev.step_current || 'N/A' }} / {{ ev.step_total || 'N/A' }}</p>
                  <p><strong>Ref Interna:</strong> {{ ev.internal_reference || 'N/A' }}</p>
                  <p><strong>Ref Externa:</strong> {{ ev.external_reference || 'N/A' }}</p>
                  <p><strong>Tipo Payload:</strong> {{ ev.payload_type || 'N/A' }}</p>
                </div>
                
                <div class="json-grids" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                  <app-json-viewer [data]="ev.request_data" title="Request Data"></app-json-viewer>
                  <app-json-viewer [data]="ev.response_data" title="Response Data"></app-json-viewer>
                  <app-json-viewer [data]="ev.payload_data" title="Payload Data" style="grid-column: 1 / -1"></app-json-viewer>
                </div>
                
                <div class="error-stack" *ngIf="ev.error_stacktrace" style="margin-top: 1rem; color: #dc2626; background: #fef2f2; padding: 1rem; border-radius: 8px;">
                  <strong style="display: block; margin-bottom: 0.5rem">Error Stacktrace:</strong>
                  <pre style="margin: 0; white-space: pre-wrap; font-size: 0.85rem; font-family: monospace;">{{ ev.error_stacktrace }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
      
      <ng-template #emptyState>
        <div class="empty-state card" style="text-align: center; padding: 4rem 2rem;">
          <span class="material-symbols-outlined empty-icon" style="font-size: 3rem; color: #d1d5db;">search_off</span>
          <h3 style="margin: 1rem 0 0.5rem; color: #111827;">Nenhum registro encontrado</h3>
          <p style="margin: 0; color: #6b7280;">Não há histórico de eventos para a transação #{{ transactionId() }}.</p>
        </div>
      </ng-template>
    </div>

    <div *ngIf="loading()" class="loading-state" style="text-align: center; padding: 4rem;">
      <span class="material-symbols-outlined spin" style="font-size: 2rem; color: #2563eb;">sync</span>
      <p style="color: #6b7280;">Carregando histórico temporal...</p>
    </div>
  `,
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  events = signal<ObservabilityEvent[]>([]);
  loading = signal<boolean>(true);
  transactionId = signal<string>('');

  constructor(private obsService: ObservabilityService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.transactionId.set(id);
        this.fetchData();
      }
    });
  }

  fetchData() {
    this.loading.set(true);
    // Ensure chronological sorting strictly by timestamp DESC
    this.obsService.getEvents({ transaction_id: this.transactionId() }, 1, 100).subscribe({
      next: (res) => {
        const sorted = (res.data || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.events.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching timeline', err);
        this.loading.set(false);
      }
    });
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'SUCCESS':
      case 'COMMITED': 
      case 'SETTLED': return 'success';
      case 'PENDING': return 'info';
      case 'HTTP_ERROR':
      case 'BUSINESS_ERROR': 
      case 'VALIDATION_FAILED':
      case 'EXCEPTION': return 'danger';
      case 'TIMEOUT': return 'warn';
      default: return 'info';
    }
  }

  getIcon(status: string): string {
    const sev = this.getSeverity(status);
    if (sev === 'success') return 'check';
    if (sev === 'danger') return 'close';
    if (sev === 'warn') return 'warning';
    return 'more_horiz';
  }
}
