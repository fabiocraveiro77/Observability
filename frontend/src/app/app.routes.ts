import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'timeline/:id',
        loadComponent: () => import('./features/timeline/timeline.component').then(m => m.TimelineComponent)
      },
      {
        path: 'heartbeats',
        loadComponent: () => import('./features/heartbeats/heartbeats.component').then(m => m.HeartbeatsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
