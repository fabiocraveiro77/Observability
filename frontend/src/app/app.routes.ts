import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TimelineComponent } from './features/timeline/timeline.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'timeline/:id', component: TimelineComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
