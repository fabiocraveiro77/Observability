import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ObservabilityEvent {
  id: number;
  timestamp: string;
  app_name: string;
  execution_id: string;
  transaction_id: string;
  trace_id: string;
  partner_name: string;
  step_current: number;
  step_total: number;
  action_code: string;
  status: string;
  payload_data: any;
  payload_type: string;
  request_data: any;
  response_data: any;
  error_stacktrace: string;
  internal_reference: string;
  external_reference: string;
}

export interface Heartbeat {
  id: number;
  timestamp: string;
  app_name: string;
  execution_id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ObservabilityStats {
  total: number;
  success: number;
  error: number;
  pendings: number;
}

@Injectable({
  providedIn: 'root'
})
export class ObservabilityService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getEvents(filters: any, page: number = 1, limit: number = 15): Observable<PaginatedResponse<ObservabilityEvent>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters.status) params = params.set('status', filters.status);
    if (filters.app_name) params = params.set('app_name', filters.app_name);
    if (filters.transaction_id) params = params.set('transaction_id', filters.transaction_id);
    if (filters.partner_name) params = params.set('partner_name', filters.partner_name);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.startDate) {
      try { params = params.set('startDate', new Date(filters.startDate).toISOString()); } catch(e){}
    }
    if (filters.endDate) {
      try { params = params.set('endDate', new Date(filters.endDate).toISOString()); } catch(e){}
    }

    return this.http.get<PaginatedResponse<ObservabilityEvent>>(`${this.apiUrl}/observability`, { params });
  }

  getHeartbeats(limit: number = 50): Observable<PaginatedResponse<Heartbeat>> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Heartbeat>>(`${this.apiUrl}/heartbeats`, { params });
  }

  getLatestHeartbeats(): Observable<Heartbeat[]> {
    return this.http.get<Heartbeat[]>(`${this.apiUrl}/heartbeats/latest`);
  }

  getApps(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/observability/apps`);
  }

  getStats(filters: any = {}): Observable<ObservabilityStats> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.app_name) params = params.set('app_name', filters.app_name);
    if (filters.transaction_id) params = params.set('transaction_id', filters.transaction_id);
    if (filters.partner_name) params = params.set('partner_name', filters.partner_name);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.startDate) {
      try { params = params.set('startDate', new Date(filters.startDate).toISOString()); } catch(e){}
    }
    if (filters.endDate) {
      try { params = params.set('endDate', new Date(filters.endDate).toISOString()); } catch(e){}
    }
    
    return this.http.get<ObservabilityStats>(`${this.apiUrl}/observability/stats`, { params });
  }
}
