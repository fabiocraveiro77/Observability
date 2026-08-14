import { Component, EventEmitter, Output, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ObservabilityService } from '../../core/services/observability.service';
import { FilterState } from '../../core/services/dashboard-state.service';

@Component({
  selector: 'app-smart-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-group">
      <div class="search-container">
        <span class="material-symbols-outlined search-icon">search</span>
        <input #searchInput class="search-input" type="text" [(ngModel)]="filters.search" (ngModelChange)="emitFilters()" placeholder="ID, App, Trace, Ref..." />
      </div>
      
      <div class="select-container">
        <span class="material-symbols-outlined select-icon">filter_list</span>
        <select class="custom-select" [(ngModel)]="filters.status" (ngModelChange)="emitFilters()">
          <option value="">Todos os Status</option>
          <option value="SUCCESS">Sucesso</option>
          <option value="HTTP_ERROR">Erro HTTP</option>
          <option value="TIMEOUT">Timeout</option>
          <option value="BUSINESS_ERROR">Erro de Negócio</option>
          <option value="EXCEPTION">Exceção</option>
          <option value="PENDING">Pendente</option>
        </select>
      </div>

      <div class="select-container">
        <span class="material-symbols-outlined select-icon">app_shortcut</span>
        <select class="custom-select" [(ngModel)]="filters.app_name" (ngModelChange)="emitFilters()">
          <option value="">Todas Aplicações</option>
          <option *ngFor="let app of availableApps()" [value]="app">{{ app }}</option>
        </select>
      </div>

      <div class="date-container">
        <input type="datetime-local" class="date-input" [(ngModel)]="filters.startDate" (ngModelChange)="emitFilters()" title="Data Inicial" />
        <span class="material-symbols-outlined date-separator">arrow_forward</span>
        <input type="datetime-local" class="date-input" [(ngModel)]="filters.endDate" (ngModelChange)="emitFilters()" title="Data Final" />
      </div>

      <button class="btn btn-outline" (click)="clearFilters()">
        <span class="material-symbols-outlined icon-left">filter_alt_off</span> Limpar
      </button>
    </div>
  `,
  styleUrls: ['./smart-filters.component.scss']
})
export class SmartFiltersComponent implements OnInit, OnDestroy {
  @Input() initialState!: FilterState;
  @Output() filtersChanged = new EventEmitter<FilterState>();
  
  availableApps = signal<string[]>([]);
  
  filters: FilterState = { search: '', status: '', partner_name: '', app_name: '', startDate: '', endDate: '' };
  
  private filterSubject = new Subject<FilterState>();

  constructor(private obsService: ObservabilityService) {}

  ngOnInit() {
    if (this.initialState) {
      this.filters = { ...this.initialState };
    }
    
    this.obsService.getApps().subscribe({
      next: (apps) => this.availableApps.set(apps),
      error: (err) => console.error('Failed to load apps', err)
    });
    
    this.filterSubject.pipe(
      debounceTime(400)
    ).subscribe(f => this.filtersChanged.emit(f));
  }

  emitFilters() {
    this.filterSubject.next({ ...this.filters });
  }

  clearFilters() {
    this.filters = { search: '', status: '', partner_name: '', app_name: '', startDate: '', endDate: '' };
    this.filterSubject.next({ ...this.filters });
  }
  
  ngOnDestroy() {
    this.filterSubject.complete();
  }
}
