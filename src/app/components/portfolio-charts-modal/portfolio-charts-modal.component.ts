import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FinanceStore } from '../../store/finance.store';

@Component({
  selector: 'app-portfolio-charts-modal',
  standalone: true,
  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portfolio-charts-modal.component.html',
  styleUrl: './portfolio-charts-modal.component.css',
})
export class PortfolioChartsModalComponent {
  store = inject(FinanceStore);
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;

  activeIndex = signal(0);
  isReady = signal(false);

  isOpen = this.store.isChartsModalOpen;

  lowerBound = signal(2); // 2%
  upperBound = signal(3); // 3%
  futureMonths = signal(6);

  // Design-system color constants (mirrors CSS token values for use in Chart.js)
  private static readonly COLOR_BORDER_CARD = '#F3F4F6'; // --color-border-card
  private static readonly COLOR_POSITIVE = '#10B981'; // --color-positive
  private static readonly COLOR_NEGATIVE = '#F43F5E'; // --color-negative
  private static readonly COLOR_ACCENT = '#3B82F6'; // --color-accent

  public stackedOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { mode: 'index', intersect: false },
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { stacked: true, grid: { color: PortfolioChartsModalComponent.COLOR_BORDER_CARD } },
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0 }, // Hide points for cleaner area look
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  public lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { mode: 'index', intersect: false },
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: PortfolioChartsModalComponent.COLOR_BORDER_CARD } },
    },
    elements: {
      point: { radius: 2, hitRadius: 10, hoverRadius: 4 },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  compositionData = computed<ChartConfiguration<'line'>['data']>(() => {
    return {
      labels: this.store.chartData().labels,
      datasets: this.store.chartData().compositionDatasets as ChartDataset<'line'>[],
    };
  });

  projectionDataConfig = computed<ChartConfiguration<'line'>['data']>(() => {
    const baseData = this.store.chartData().totalValueData;
    const labels = [...this.store.chartData().labels];
    const dataSize = baseData.length;

    // Create base historic series
    const historicData = [...baseData];
    const lowerProjData: (number | null)[] = Array(dataSize).fill(null);
    const upperProjData: (number | null)[] = Array(dataSize).fill(null);

    if (dataSize > 0) {
      const lastVal = baseData[dataSize - 1];

      // Link the lines seamlessly
      lowerProjData[dataSize - 1] = lastVal;
      upperProjData[dataSize - 1] = lastVal;

      let prevLower = lastVal;
      let prevUpper = lastVal;

      // Generate future labels beautifully aligned with actual months
      const lastLabel = labels[labels.length - 1]; // e.g. "Mar 2025"
      const parts = lastLabel.trim().split(' ');
      const mStr = parts[0];
      let yNum = parseInt(parts[1], 10);
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      let mIdx = monthNames.findIndex((m) => m.toLowerCase().includes(mStr.toLowerCase()));
      if (mIdx === -1) mIdx = 0;

      for (let i = 1; i <= this.futureMonths(); i++) {
        if (mIdx === 11) {
          mIdx = 0;
          yNum++;
        } else {
          mIdx++;
        }
        labels.push(monthNames[mIdx] + ' ' + yNum);

        prevLower = prevLower * (1 + this.lowerBound() / 100);
        prevUpper = prevUpper * (1 + this.upperBound() / 100);
        (historicData as (number | null)[]).push(null);
        lowerProjData.push(prevLower);
        upperProjData.push(prevUpper);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Total Value',
          data: historicData as (number | null)[],
          borderColor: PortfolioChartsModalComponent.COLOR_POSITIVE,
          backgroundColor: `${PortfolioChartsModalComponent.COLOR_POSITIVE}33`,
          borderWidth: 2,
          tension: 0.1,
          fill: true,
        } as ChartDataset<'line'>,
        {
          label: 'Lower Bound (+' + this.lowerBound() + '%) ',
          data: lowerProjData as (number | null)[],
          borderColor: PortfolioChartsModalComponent.COLOR_NEGATIVE,
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.1,
        } as ChartDataset<'line'>,
        {
          label: 'Upper Bound (+' + this.upperBound() + '%) ',
          data: upperProjData as (number | null)[],
          borderColor: PortfolioChartsModalComponent.COLOR_ACCENT,
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.1,
        } as ChartDataset<'line'>,
      ],
    };
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.activeIndex.set(0);
        setTimeout(() => this.isReady.set(true), 50);
      } else {
        this.isReady.set(false);
      }
    });
  }

  open() {
    this.store.toggleCharts(true);
  }

  close() {
    this.store.toggleCharts(false);
  }

  onScroll(e: Event) {
    const target = e.target as HTMLDivElement;
    const index = Math.round(target.scrollLeft / window.innerWidth);
    if (this.activeIndex() !== index) {
      this.activeIndex.set(index);
    }
  }

  scrollTo(index: number) {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollTo({
        left: window.innerWidth * index,
        behavior: 'smooth',
      });
    }
  }

  next() {
    this.scrollTo(Math.min(this.activeIndex() + 1, 1));
  }

  prev() {
    this.scrollTo(Math.max(this.activeIndex() - 1, 0));
  }

  updateInput(field: 'lowerBound' | 'upperBound' | 'futureMonths', e: Event) {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(val)) {
      if (field === 'lowerBound') this.lowerBound.set(val);
      if (field === 'upperBound') this.upperBound.set(val);
      if (field === 'futureMonths') this.futureMonths.set(Math.max(1, Math.min(60, val)));
    }
  }
}
