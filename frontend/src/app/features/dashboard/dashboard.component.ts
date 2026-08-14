import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ObservabilityService, ObservabilityEvent, ObservabilityStats } from '../../core/services/observability.service';
import { SmartFiltersComponent } from '../smart-filters/smart-filters.component';
import { JsonViewerComponent } from '../json-viewer/json-viewer.component';
import { DashboardStateService, FilterState } from '../../core/services/dashboard-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, SmartFiltersComponent, JsonViewerComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private obsService = inject(ObservabilityService);
  public stateService = inject(DashboardStateService);

  logs = signal<ObservabilityEvent[]>([]);
  stats = signal<ObservabilityStats>({ total: 0, success: 0, error: 0, pendings: 0 });
  loading = signal<boolean>(true);
  
  // Pagination from state service
  currentPage = this.stateService.currentPage;
  rowsPerPage = this.stateService.rowsPerPage;
  totalRecords = signal<number>(0);

  // Filters from state service
  currentFilters = this.stateService.currentFilters;

  // Selection state from state service
  selectedItems = this.stateService.selectedItems;
  showOnlySelected = this.stateService.showOnlySelected;

  // Displayed Logs
  displayedLogs = computed(() => {
    if (this.showOnlySelected()) {
      return Array.from(this.selectedItems().values());
    }
    return this.logs();
  });

  // Expanded Rows State
  expandedRowIds = this.stateService.expandedRowIds;

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.rowsPerPage()) || 1);

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    const filters = this.currentFilters();
    
    // Fetch stats
    this.obsService.getStats(filters).subscribe({
      next: (res) => this.stats.set(res),
      error: (err) => console.error('Error fetching stats', err)
    });

    // Fetch events
    this.obsService.getEvents(filters, this.currentPage(), this.rowsPerPage()).subscribe({
      next: (res) => {
        const sortedLogs = res.data || [];
        this.logs.set(sortedLogs);
        this.totalRecords.set(res.total || 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching observability events', err);
        this.loading.set(false);
      }
    });
  }

  onFiltersChanged(filters: FilterState) {
    this.currentFilters.set(filters);
    this.currentPage.set(1);
    this.fetchData();
  }

  toggleRow(id: number) {
    const current = new Set(this.expandedRowIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.expandedRowIds.set(current);
  }

  toggleSelection(log: ObservabilityEvent, event: Event) {
    event.stopPropagation();
    const current = new Map(this.selectedItems());
    if (current.has(log.id)) {
      current.delete(log.id);
    } else {
      current.set(log.id, log);
    }
    this.selectedItems.set(current);
  }

  toggleSelectAllPage(event: Event) {
    event.stopPropagation();
    const current = new Map(this.selectedItems());
    const allSelected = this.isAllPageSelected();

    if (allSelected) {
      this.logs().forEach(log => current.delete(log.id));
    } else {
      this.logs().forEach(log => current.set(log.id, log));
    }
    this.selectedItems.set(current);
  }

  isAllPageSelected(): boolean {
    const currentLogs = this.logs();
    if (currentLogs.length === 0) return false;
    return currentLogs.every(log => this.selectedItems().has(log.id));
  }

  toggleShowSelected() {
    this.showOnlySelected.update((v: boolean) => !v);
  }

  getSeverity(status: string): "success" | "info" | "warn" | "danger" | "secondary" {
    switch (status) {
      case 'SUCCESS': return 'success';
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

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p: number) => p + 1);
      this.fetchData();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p: number) => p - 1);
      this.fetchData();
    }
  }
}
