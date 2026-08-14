import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="json-viewer-container" [class.collapsed]="!isExpanded()">
      <div class="json-header" (click)="toggle()">
        <span class="material-symbols-outlined">data_object</span>
        <span>{{ title }}</span>
        <span class="material-symbols-outlined toggle-icon">{{ isExpanded() ? 'expand_less' : 'expand_more' }}</span>
      </div>
      <pre class="json-code" *ngIf="isExpanded()"><code>{{ formattedJson() }}</code></pre>
    </div>
  `,
  styleUrls: ['./json-viewer.component.scss']
})
export class JsonViewerComponent {
  @Input() data: any;
  @Input() title: string = 'Payload JSON';
  @Input() startsExpanded: boolean = false;

  isExpanded = signal<boolean>(false);

  ngOnInit() {
    this.isExpanded.set(this.startsExpanded);
  }

  formattedJson = computed(() => {
    if (!this.data) return 'null';
    try {
      const parsed = typeof this.data === 'string' ? JSON.parse(this.data) : this.data;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return String(this.data);
    }
  });

  toggle() {
    this.isExpanded.update(v => !v);
  }
}
