import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartOptions, TooltipItem, ScriptableContext, ActiveElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FinanceStore } from '../../store/finance.store';
import { hexToRgba } from '../../utils/color.util';

@Component({
  selector: 'app-portfolio-charts-modal',
  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portfolio-charts-modal.component.html',
  styleUrl: './portfolio-charts-modal.component.css',
})
export class PortfolioChartsModalComponent {
  store = inject(FinanceStore);
  readonly carouselContainer = viewChild.required<ElementRef<HTMLDivElement>>('carouselContainer');

  activeIndex = signal(0);
  isReady = signal(false);
  chartAreaSignal = signal<{ left: number, width: number } | null>(null);
  isOpen = this.store.isChartsModalOpen;

  lowerBound = signal(2); // 2%
  upperBound = signal(3); // 3%
  futureMonths = signal(6);

  // Design-system color constants (mirrors CSS token values for use in Chart.js)
  private static readonly COLOR_BORDER_CARD = '#F3F4F6'; // --color-border-card
  private static readonly COLOR_POSITIVE = '#10B981'; // --color-positive
  private static readonly COLOR_NEGATIVE = '#F43F5E'; // --color-negative
  private static readonly COLOR_ACCENT = '#3B82F6'; // --color-accent

  charts = viewChildren(BaseChartDirective);

  public stackedOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { bottom: 0, left: 0, right: 0, top: 0 }
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        usePointStyle: true,
        padding: 12,
        cornerRadius: 12,
        boxPadding: 4,
        boxWidth: 8,
        boxHeight: 8,
        callbacks: {
          labelColor: (context: TooltipItem<'line'>) => {
            return {
              borderColor: '#fff',
              backgroundColor: (context.dataset.borderColor as string) || '#000',
              borderWidth: 2.5
            };
          }
        }
      },
      legend: { display: false }
    },
    scales: {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        stacked: true,
        grid: { color: PortfolioChartsModalComponent.COLOR_BORDER_CARD },
        ticks: { color: '#94A3B8', font: { weight: 'bold' } }
      }
    },
    elements: {
      line: { tension: 0.4, borderWidth: 2 },
      point: {
        radius: 0,
        borderWidth: 2,
        hoverRadius: 6,
        hoverBorderWidth: 0,
        hoverBackgroundColor: (ctx: ScriptableContext<'line'>) => ctx.dataset.borderColor as string,
        hoverBorderColor: (ctx: ScriptableContext<'line'>) => ctx.dataset.borderColor as string
      }
    },
    interaction: {
      mode: 'index',
      axis: 'x',
      intersect: false,
    },
  };

  public lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { bottom: 0, left: 0, right: 0, top: 0 }
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        usePointStyle: true,
        padding: 12,
        cornerRadius: 12,
        boxPadding: 4,
        boxWidth: 8,
        boxHeight: 8,
        callbacks: {
          labelColor: (context: TooltipItem<'line'>) => {
            return {
              borderColor: '#fff',
              backgroundColor: (context.dataset.borderColor as string) || '#000',
              borderWidth: 2.5
            };
          }
        }
      },
      legend: { display: false }
    },
    scales: {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        grid: { color: PortfolioChartsModalComponent.COLOR_BORDER_CARD },
        ticks: { color: '#94A3B8', font: { weight: 'bold' } }
      }
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 6,
        hoverBorderWidth: 0,
        hoverBackgroundColor: (ctx: ScriptableContext<'line'>) => ctx.dataset.borderColor as string,
        hoverBorderColor: (ctx: ScriptableContext<'line'>) => ctx.dataset.borderColor as string
      }
    },
    interaction: {
      mode: 'index',
      axis: 'x',
      intersect: false,
    },
  };

  compositionData = computed<ChartConfiguration<'line'>['data']>(() => {
    const rawData = this.store.chartData();
    const datasets = (rawData.compositionDatasets as ChartDataset<'line'>[]).map(ds => ({
      ...ds,
      backgroundColor: (context: ScriptableContext<'line'>) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return 'transparent';
        const color = ds.borderColor as string;
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        // Calibrated gradient: 30% at top to 5% at bottom for consistent visibility
        gradient.addColorStop(0, hexToRgba(color, 0.3));
        gradient.addColorStop(1, hexToRgba(color, 0.05));
        return gradient;
      }
    }));
    return {
      labels: rawData.labels,
      datasets
    };
  });

  timelineLabels = computed(() => {
    const labels = this.store.chartData().labels;
    return labels.map((l, i) => {
      const parts = l.trim().split(' ');
      const month = parts[0];
      const year = parts[1];
      const prev = i > 0 ? labels[i - 1].trim().split(' ')[1] : null;
      return {
        month: month.substring(0, 3),
        year: year,
        isNewYear: year !== prev,
        index: i
      };
    });
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
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'transparent';
            const color = PortfolioChartsModalComponent.COLOR_POSITIVE;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, hexToRgba(color, 0.3));
            gradient.addColorStop(1, hexToRgba(color, 0.05));
            return gradient;
          },
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
    const carouselContainer = this.carouselContainer();
    if (carouselContainer) {
      carouselContainer.nativeElement.scrollTo({
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

  /**
   * Manual interaction handler to bridge labels -> chart tooltip.
   * Uses the X-axis scale directly to find the nearest month index, 
   * bypassing Chart.js's internal chartArea boundary checks.
   */
  handleMouseMove(event: MouseEvent) {
    const currentChart = this.charts()[this.activeIndex()];
    if (!currentChart?.chart) return;

    const chart = currentChart.chart;

    // Update chart area layout info for timeline alignment
    if (chart.chartArea) {
      this.chartAreaSignal.set({
        left: chart.chartArea.left,
        width: chart.chartArea.width
      });
    }

    const canvasRect = chart.canvas.getBoundingClientRect();
    const relativeX = event.clientX - canvasRect.left;
    const relativeY = event.clientY - canvasRect.top;

    // Direct mapping: X pixel -> Month Index
    const xAxis = chart.scales['x'];
    if (!xAxis) return;

    const pixelValue = xAxis.getValueForPixel(relativeX);
    if (pixelValue === undefined) return;

    const index = Math.round(pixelValue);

    if (index >= 0 && index < chart.data.labels!.length) {
      // Find all elements at this index across all datasets
      const elements: ActiveElement[] = [];
      for (let i = 0; i < chart.data.datasets.length; i++) {
        const meta = chart.getDatasetMeta(i);
        if (meta.hidden) continue;
        const element = meta.data[index];
        if (element) {
          elements.push({
            datasetIndex: i,
            index: index,
            element: element
          });
        }
      }

      if (elements.length > 0) {
        chart.setActiveElements(elements);

        // Force tooltip at the cursor horizontal position, 
        // anchored vertically within the chart area even if hovering labels.
        const chartArea = chart.chartArea;
        const tooltipY = Math.max(chartArea.top, Math.min(chartArea.bottom - 5, relativeY)) as number;
        const tx = relativeX as number;

        chart.tooltip?.setActiveElements(elements, { x: tx, y: tooltipY });
        chart.update('none'); // Update view without animation
      }
    }
  }

  handleMouseLeave() {
    const currentChart = this.charts()[this.activeIndex()];
    if (!currentChart?.chart) return;

    currentChart.chart.setActiveElements([]);
    currentChart.chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
    currentChart.chart.update('none');
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
