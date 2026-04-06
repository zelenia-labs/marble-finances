import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 mt-2"
      title="Cash: {{ cashPercent() | number: '1.0-0' }}% | Investments: {{
        invPercent() | number: '1.0-0'
      }}%"
    >
      @if (cashPercent() > 0) {
        <div
          class="bg-asset-purple transition-all duration-300 h-full"
          [style.width.%]="cashPercent()"
        ></div>
      }
      @if (invPercent() > 0) {
        <div
          class="bg-asset-green transition-all duration-300 h-full"
          [style.width.%]="invPercent()"
        ></div>
      }
    </div>
  `,
})
export class SparklineComponent {
  cashPercent = input.required<number>();
  invPercent = input.required<number>();
}
