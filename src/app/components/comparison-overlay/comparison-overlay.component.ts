import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FinanceStore, formatHumanUSD } from '../../store/finance.store';

@Component({
  selector: 'app-comparison-overlay',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'absolute top-0 -translate-y-[80px] left-1/2 -translate-x-1/2 z-50 bg-white rounded-[40px] border-2 border-slate/10 p-12 flex overflow-hidden transition-all w-max animate-reveal-pulse shadow-2xl drop-shadow-2xl',
  },
  templateUrl: './comparison-overlay.component.html',
})
export class ComparisonOverlayComponent {
  baseId = input.required<string>();
  targetId = input.required<string>();
  store = inject(FinanceStore);

  baseMonth = computed(() => this.store.months().find((m) => m.id === this.baseId()));
  targetMonth = computed(() => this.store.months().find((m) => m.id === this.targetId()));

  baseStats = computed(() => this.store.monthStats().get(this.baseId()));
  targetStats = computed(() => this.store.monthStats().get(this.targetId()));

  multi = computed(() => this.store.marbleMultiplier());

  categories = computed(() => {
    const base = this.baseMonth();
    const target = this.targetMonth();
    if (!base || !target) return [];

    const map = new Map<
      string,
      { label: string; color: string; baseVal: number; targetVal: number }
    >();

    base.assetCategories.forEach((c) => {
      const key = c.label.toLowerCase().trim();
      map.set(key, {
        label: c.label,
        color: c.color,
        baseVal: c.assets.reduce((sum, a) => sum + a.val, 0),
        targetVal: 0,
      });
    });

    target.assetCategories.forEach((c) => {
      const key = c.label.toLowerCase().trim();
      const val = c.assets.reduce((sum, a) => sum + a.val, 0);
      if (map.has(key)) {
        map.get(key)!.targetVal = val;
      } else {
        map.set(key, { label: c.label, color: c.color, baseVal: 0, targetVal: val });
      }
    });

    // Sort based on the order in the base month's assetCategories array
    const baseOrder = base.assetCategories.map((c) => c.label.toLowerCase().trim());

    return Array.from(map.values()).sort((a, b) => {
      const indexA = baseOrder.indexOf(a.label.toLowerCase().trim());
      const indexB = baseOrder.indexOf(b.label.toLowerCase().trim());

      // If both exist in base, use their relative order
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      // If only A exists in base, A comes first
      if (indexA !== -1) return -1;
      // If only B exists in base, B comes first
      if (indexB !== -1) return 1;
      // Both are new categories, sort by value
      return b.baseVal - a.baseVal;
    });
  });

  formatUSD(val: number): string {
    return formatHumanUSD(val, this.store.marbleMultiplier());
  }

  close() {
    this.store.clearComparison();
  }
}
