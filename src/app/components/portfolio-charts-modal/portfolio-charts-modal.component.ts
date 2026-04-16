import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { Chart, ChartConfiguration, ChartDataset, ChartOptions, TooltipItem, ScriptableContext, ActiveElement, Tooltip, TooltipModel } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FinanceStore } from '../../store/finance.store';
import { hexToRgba } from '../../utils/color.util';

declare module 'chart.js' {
  interface TooltipPositionerMap {
    anchorTop: (items: readonly ActiveElement[], eventPosition: { x: number; y: number }) => { x: number; y: number } | false;
  }
}

interface InternalChartElement {
  x: number;
  y: number;
  $context: {
    chart: Chart;
    dataset: { label: string };
  };
}

export interface CustomTooltipItem {
  label: string;
  value: string;
  color: string;
  raw: unknown;
}

export interface CustomTooltipData {
  title: string;
  items: CustomTooltipItem[];
  x: number;
  y: number;
  opacity: number;
  side: 'left' | 'right';
}

// Register custom tooltip positioner to anchor exactly at the top dot with a 14px gap
Tooltip.positioners.anchorTop = function (items: readonly ActiveElement[]) {
  if (items.length === 0) return false;
  const top = items.reduce((prev, curr) => {
    const prevY = (prev.element as unknown as InternalChartElement).y;
    const currY = (curr.element as unknown as InternalChartElement).y;
    return currY < prevY ? curr : prev;
  });

  // Access internal context safely through our transition interface
  const element = top.element as unknown as InternalChartElement;
  const { x, y } = element;
  const chart = element.$context.chart;

  const isRightHalf = x > (chart.chartArea.left + chart.chartArea.width / 2);
  return {
    x: x + (isRightHalf ? -14 : 14), // 14px horizontal gap (increased from 10px)
    y: y
  };
};

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
  activeTooltip = signal<CustomTooltipData | null>(null);
  focusedLabel = signal<string>('');
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
    events: [], // Disable internal interactions to allow custom manual tooltip anchoring
    layout: {
      padding: { bottom: 0, left: 0, right: 0, top: 0 }
    },
    plugins: {
      tooltip: {
        enabled: false,
        external: (context: { chart: Chart; tooltip: TooltipModel<'line'> }) => this.handleExternalTooltip(context),
        position: 'anchorTop',
        mode: 'index',
        intersect: false,
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
    events: [],
    layout: {
      padding: { bottom: 0, left: 0, right: 0, top: 0 }
    },
    plugins: {
      tooltip: {
        enabled: false,
        external: (context: { chart: Chart; tooltip: TooltipModel<'line'> }) => this.handleExternalTooltip(context),
        position: 'anchorTop',
        mode: 'index',
        intersect: false,
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

  timelineLabels = computed(() => {
    const months = this.store.months();
    const futureCount = this.futureMonths();
    const lastMonth = months[months.length - 1];
    
    // Create extended timeline labels
    const labels = months.map((m, i) => {
      const date = new Date(m.date);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        isNewYear: date.getMonth() === 0 || i === 0,
        index: i
      };
    });

    // Add future months
    const lastDate = new Date(lastMonth.date);
    for (let i = 1; i <= futureCount; i++) {
        const date = new Date(lastDate.getFullYear(), lastDate.getMonth() + i);
        const month = date.getMonth();
        const year = date.getFullYear();
        labels.push({
            month: date.toLocaleString('default', { month: 'short' }),
            year: year,
            isNewYear: month === 0,
            index: months.length + i - 1
        });
    }

    return labels;
  });

  compositionData = computed<ChartConfiguration<'line'>['data']>(() => {
    const data = this.store.chartData();
    return {
      labels: data.labels,
      datasets: (data.compositionDatasets as ChartDataset<'line'>[]).map((ds, i) => ({
        ...ds,
        fill: i === 0 ? 'origin' : '-1',
        pointHoverBackgroundColor: ds.borderColor,
        pointHoverBorderColor: ds.borderColor,
      }))
    };
  });

  projectionDataConfig = computed<ChartConfiguration<'line'>['data']>(() => {
    const months = this.store.months();
    const lowerRate = this.lowerBound() / 100;
    const upperRate = this.upperBound() / 100;
    const futureCount = this.futureMonths();

    const lastTotalValue = months[months.length - 1].assetCategories.reduce((sum, cat) => 
        sum + cat.assets.reduce((s, a) => s + a.val, 0), 0
    );

    const labels = this.timelineLabels().map(m => `${m.month} ${m.year}`);
    
    // Historical data
    const historical = months.map(m => m.assetCategories.reduce((sum, cat) => 
        sum + cat.assets.reduce((s, a) => s + a.val, 0), 0
    ));

    // Projections
    const lower = [...historical];
    const upper = [...historical];
    const current = [...historical];

    for (let i = 1; i <= futureCount; i++) {
        const factor = i / 12;
        lower.push(lastTotalValue * Math.pow(1 + lowerRate, factor));
        upper.push(lastTotalValue * Math.pow(1 + upperRate, factor));
        current.push(lastTotalValue);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Upper Bound',
          data: upper,
          borderColor: '#10B981',
          backgroundColor: hexToRgba('#10B981', 0.1),
          fill: 2, // Fill to Lower Bound
          pointStyle: false,
        } as ChartDataset<'line'>,
        {
          label: 'Lower Bound',
          data: lower,
          borderColor: '#F43F5E',
          backgroundColor: 'transparent',
          fill: false,
          pointStyle: false,
        } as ChartDataset<'line'>,
        {
          label: 'Current Value',
          data: current,
          borderColor: '#64748B',
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          fill: false,
          pointStyle: false,
        } as ChartDataset<'line'>,
      ]
    };
  });

  onScroll(event: Event) {
    const el = event.target as HTMLDivElement;
    const index = Math.round(el.scrollLeft / window.innerWidth);
    this.activeIndex.set(index);
  }

  scrollTo(index: number) {
    const el = this.carouselContainer().nativeElement;
    el.scrollTo({ left: index * window.innerWidth, behavior: 'smooth' });
  }

  next() {
    if (this.activeIndex() < 1) this.scrollTo(this.activeIndex() + 1);
  }

  prev() {
    if (this.activeIndex() > 0) this.scrollTo(this.activeIndex() - 1);
  }

  close() {
    this.store.toggleCharts(false);
  }

  handleMouseMove(event: MouseEvent) {
    const currentChart = this.charts()[this.activeIndex()];
    if (!currentChart?.chart) return;

    const chart = currentChart.chart;
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

        // Find specific focus for highlight
        const nearest = elements.reduce((prev, curr) => {
          const prevY = (prev.element as unknown as InternalChartElement).y;
          const currY = (curr.element as unknown as InternalChartElement).y;
          return Math.abs(currY - relativeY) < Math.abs(prevY - relativeY) ? curr : prev;
        });
        this.focusedLabel.set((nearest.element as unknown as InternalChartElement).$context.dataset.label || '');

        // Position is now handled by the custom 'anchorTop' positioner
        chart.update('none'); // Update view without animation
      }
    }
  }

  handleMouseLeave() {
    const currentChart = this.charts()[this.activeIndex()];
    if (!currentChart?.chart) return;

    currentChart.chart.setActiveElements([]);
    currentChart.chart.update('none');
  }

  handleExternalTooltip(context: { chart: Chart; tooltip: TooltipModel<'line'> }) {
    const { chart, tooltip } = context;
    if (tooltip.opacity === 0) {
      this.activeTooltip.set(null);
      return;
    }

    const title = tooltip.title?.[0] || '';
    const items: CustomTooltipItem[] = tooltip.dataPoints
      .map((dp: TooltipItem<'line'>) => {
        const color = (dp.dataset.borderColor as string) || '#000';
        const label = dp.dataset.label || '';
        const value = dp.formattedValue || '';
        const raw = dp.raw;
        return { label, value, color, raw };
      })
      .filter((item: CustomTooltipItem) => item.raw !== null && item.raw !== undefined)
      .reverse(); // Reverse list to match the visual 'Top-to-Bottom' stack of the chart

    const rect = chart.canvas.getBoundingClientRect();
    const side = tooltip.caretX > (chart.chartArea.left + chart.chartArea.width / 2) ? 'right' : 'left';

    this.activeTooltip.set({
      title,
      items,
      x: rect.left + tooltip.caretX,
      y: rect.top + tooltip.caretY,
      opacity: tooltip.opacity,
      side
    });
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
