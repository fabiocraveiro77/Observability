import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, BehaviorSubject, timer, forkJoin, of } from 'rxjs';
import { switchMap, takeUntil, catchError, filter } from 'rxjs/operators';
import { ObservabilityService, Heartbeat } from '../../core/services/observability.service';

@Component({
  selector: 'app-heartbeats',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './heartbeats.component.html',
  styleUrls: ['./heartbeats.component.scss']
})
export class HeartbeatsComponent implements OnInit, OnDestroy {
  private obsService = inject(ObservabilityService);
  private destroy$ = new Subject<void>();
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  latestHeartbeats = signal<Heartbeat[]>([]);
  historyHeartbeats = signal<Heartbeat[]>([]);
  loading = signal<boolean>(false);
  lastUpdate = signal<Date | null>(null);

  ngOnInit() {
    this.refreshTrigger$
      .pipe(
        switchMap(() => {
          this.loading.set(true);
          return timer(0, 15000).pipe(
            switchMap(() => {
              return forkJoin({
                latest: this.obsService.getLatestHeartbeats().pipe(catchError(() => of([]))),
                history: this.obsService.getHeartbeats(10).pipe(catchError(() => of({ data: [], total: 0, page: 1, limit: 10 })))
              });
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          const sortedLatest = (res.latest || []).sort((a: Heartbeat, b: Heartbeat) => a.app_name.localeCompare(b.app_name));
          this.latestHeartbeats.set(sortedLatest);
          this.historyHeartbeats.set(res.history.data || []);
          this.lastUpdate.set(new Date());
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error polling heartbeats', err);
          this.loading.set(false);
        }
      });
  }

  isAlive(timestamp: string): boolean {
    if (!timestamp) return false;
    const hbTime = new Date(timestamp).getTime();
    const now = Date.now();
    return (now - hbTime) <= 30000; // <= 30 seconds
  }

  manualRefresh() {
    if (!this.loading()) {
      this.refreshTrigger$.next();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
