import { Injectable, signal } from '@angular/core';
import { ObservabilityEvent } from './observability.service';

export interface FilterState {
  search: string;
  status: string;
  partner_name: string;
  app_name: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  currentPage = signal<number>(1);
  rowsPerPage = signal<number>(15);
  currentFilters = signal<FilterState>({ 
    search: '', 
    status: '', 
    partner_name: '', 
    app_name: '',
    startDate: '',
    endDate: ''
  });
  showOnlySelected = signal<boolean>(false);
  selectedItems = signal<Map<number, ObservabilityEvent>>(new Map());
  expandedRowIds = signal<Set<number>>(new Set());
}
