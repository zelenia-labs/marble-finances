import { Component, ChangeDetectionStrategy, inject, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FinanceStore, sumAssets, formatHumanUSD } from '../../store/finance.store';

@Component({
  selector: 'app-summary-panel',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './summary-panel.component.html',
})
export class SummaryPanelComponent {
  monthIndex = input.required<number>();
  liquidNetWorth = input<number>(0);
  mtm = input<number>(0);
  store = inject(FinanceStore);

  monthRecord = computed(() => this.store.months()[this.monthIndex()]);
  todayTotal = computed(() => sumAssets(this.monthRecord().assetCategories));

  previousTotal = computed(() => {
    const idx = this.monthIndex();
    if (idx === 0) return null;
    return sumAssets(this.store.months()[idx - 1].assetCategories);
  });

  startOfYearTotal = computed(() => {
    const months = this.store.months();
    if (months.length === 0) return null;
    const year = this.monthRecord().date.split(' ').pop();
    const earliestThisYear = months.find((m) => m.date.endsWith(year!));
    if (!earliestThisYear) return null;
    return sumAssets(earliestThisYear.assetCategories);
  });

  todayVsPrevious = computed(() => {
    const p = this.previousTotal();
    if (!p || p === 0) return null;
    return ((this.todayTotal() - p) / p) * 100;
  });

  todayVsStartOfYear = computed(() => {
    const s = this.startOfYearTotal();
    if (!s || s === 0) return null;
    return ((this.todayTotal() - s) / s) * 100;
  });

  previousVsStartOfYear = computed(() => {
    const p = this.previousTotal();
    const s = this.startOfYearTotal();
    if (!p || !s || s === 0) return null;
    return ((p - s) / s) * 100;
  });

  /** Format a number as a display value interpreting blocks against the multiplier */
  fmt(blocks: number): string {
    return formatHumanUSD(blocks, this.store.marbleMultiplier());
  }

  /** Format a percentage with sign */
  fmtPct(val: number | null): string {
    if (val === null) return '—';
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  }

  /** True if pct is positive */
  isPositive(val: number | null): boolean {
    return val !== null && val >= 0;
  }

  /** Data row for the three-column table */
  rows = computed(() => ({
    today: this.todayTotal(),
    previous: this.previousTotal(),
    startOfYear: this.startOfYearTotal(),
  }));

  /** Percentage column values — between adjacent columns */
  pcts = computed(() => ({
    todayVsPrevious: this.todayVsPrevious(),
    todayVsStartOfYear: this.todayVsStartOfYear(),
    previousVsStartOfYear: this.previousVsStartOfYear(),
  }));
}
