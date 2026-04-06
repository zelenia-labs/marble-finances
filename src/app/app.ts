import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { ComparisonOverlayComponent } from './components/comparison-overlay/comparison-overlay.component';
import { AddAssetModalComponent } from './components/modals/add-asset-modal.component';
import { CompareSelectModalComponent } from './components/modals/compare-select-modal.component';
import { DeleteModalComponent } from './components/modals/delete-modal.component';
import { ForwardModalComponent } from './components/modals/forward-modal.component';
import { MonthBoardComponent } from './components/month-board/month-board.component';
import { PortfolioChartsModalComponent } from './components/portfolio-charts-modal/portfolio-charts-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { TimelineSidebarComponent } from './components/timeline-sidebar/timeline-sidebar.component';
import { TooltipService } from './services/tooltip.service';
import { FinanceStore } from './store/finance.store';
import { calculateCenteringCoordinates } from './utils/geometry.utils';

@Component({
  selector: 'app-root',
  imports: [
    NgOptimizedImage,
    AddAssetModalComponent,
    DeleteModalComponent,
    ForwardModalComponent,
    TimelineSidebarComponent,
    MonthBoardComponent,
    PortfolioChartsModalComponent,
    SettingsModalComponent,
    CompareSelectModalComponent,
    ComparisonOverlayComponent,
    DecimalPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  host: {
    '(window:keydown)': 'onKeyDown($event)',
  },
})
export class App implements OnDestroy {
  store = inject(FinanceStore);
  tooltipService = inject(TooltipService);

  @ViewChild('mainArea') mainArea!: ElementRef<HTMLElement>;
  @ViewChild(PortfolioChartsModalComponent) chartsModal!: PortfolioChartsModalComponent;

  constructor() {
    effect(() => {
      const compare = this.store.compareState();
      if (compare) {
        // Find the index of the base month
        const months = untracked(() => this.store.months());
        const idx = months.findIndex((m) => m.id === compare.baseMonthId);

        if (idx !== -1) {
          // Delay to ensure the overlay is rendered and measured
          setTimeout(() => {
            const boards = document.querySelectorAll('app-month-board > div');
            const target = boards[idx] as HTMLElement;
            const overlay = document.querySelector('app-comparison-overlay') as HTMLElement;

            if (target) {
              const padding = 40;
              const screenW = window.innerWidth;
              const screenH = window.innerHeight;

              // Base board dimensions
              const bWidth = target.offsetWidth;
              const bHeight = target.offsetHeight;

              // Total logical height to frame: board height + overlay height + gap
              const overlayHeight = overlay ? overlay.offsetHeight + 32 : 340;
              const totalLogicalHeight = bHeight + overlayHeight;
              const totalLogicalWidth = Math.max(bWidth, overlay ? overlay.offsetWidth : 0);

              const topActionBuffer = 96;
              let comparisonScale = (screenH - padding - topActionBuffer) / totalLogicalHeight;
              const widthScale = (screenW - padding) / totalLogicalWidth;
              comparisonScale = Math.min(comparisonScale, widthScale, 0.45);

              this.scale.set(comparisonScale);

              // Recalculate Pan
              let offsetL = 0;
              let offsetT = 0;
              let el: HTMLElement | null = target;
              const wrapper = this.mainArea.nativeElement.querySelector(
                '#canvas-wrapper',
              ) as HTMLElement;
              while (el && el !== wrapper) {
                offsetL += el.offsetLeft;
                offsetT += el.offsetTop;
                el = el.offsetParent as HTMLElement;
              }

              const protrudingHeight = 80;
              const totalRenderHeight = bHeight + protrudingHeight;
              const centerX = (screenW - bWidth * comparisonScale) / 2 - offsetL * comparisonScale;
              const centerY =
                (screenH + topActionBuffer - totalRenderHeight * comparisonScale) / 2 -
                (offsetT - protrudingHeight) * comparisonScale;

              this.isAnimatingPan.set(true);
              this.panX.set(centerX);
              this.panY.set(centerY);
              this.updateTransform();

              setTimeout(() => {
                this.isAnimatingPan.set(false);
                this.store.setCompareRibbonVisible(true);
              }, 800);
            }
          }, 60);
        }
      }
    });

    // Handle re-centering when comparison is dismissed
    let lastBaseId: string | null = null;
    effect(() => {
      const compare = this.store.compareState();
      if (compare) {
        lastBaseId = compare.baseMonthId;
      } else if (lastBaseId) {
        const months = untracked(() => this.store.months());
        const idx = months.findIndex((m) => m.id === lastBaseId);
        if (idx !== -1) {
          setTimeout(() => {
            const boards = document.querySelectorAll('app-month-board > div');
            const target = boards[idx] as HTMLElement;
            if (target) {
              this.centerOnBoard(target);
            }
          }, 10);
        }
        lastBaseId = null;
      }
    });

    // Unified stealth-framing on first load of data
    let initialFramingDone = false;
    effect(() => {
      const months = this.store.months();
      if (months.length > 0 && !initialFramingDone) {
        initialFramingDone = true;
        // Extended delay to ensure the board layout and offsets have fully stabilized
        setTimeout(() => {
          this.jumpToLatestMonth(false);
        }, 850);
      } else if (months.length === 0) {
        initialFramingDone = false;
        this.isCanvasReady.set(false);
      }
    });

    // Native 60fps listeners (no zone-wrapping needed in Zoneless)
    window.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    window.addEventListener('mouseup', () => this.onMouseUp());
    window.addEventListener('resize', () => this.onResize());
  }

  scale = signal<number>(1);
  panX = signal<number>(0);
  panY = signal<number>(0);
  canvasTransform = signal<string>('translate(0px, 0px) scale(1)');
  isPanningCanvas = signal<boolean>(false);
  isCanvasReady = signal<boolean>(false);
  isAnimatingPan = signal<boolean>(false);

  private startX = 0;
  private startY = 0;

  @ViewChild('tooltipPopover', { static: false }) set tooltipPopover(ref: ElementRef<HTMLElement>) {
    if (ref) this.tooltipService.setPopoverRef(ref);
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    window.removeEventListener('mouseup', () => this.onMouseUp());
    window.removeEventListener('resize', () => this.onResize());
  }

  private updateTransform() {
    this.canvasTransform.set(
      `translate(${this.panX()}px, ${this.panY()}px) scale(${this.scale()})`,
    );
    this.updateActiveTimelineTracker();

    if (!this.isCanvasReady()) {
      this.isCanvasReady.set(true);
    }
  }

  jumpToTimelineIndex(idx: number) {
    const boards = document.querySelectorAll('app-month-board > div');
    const target = boards[idx] as HTMLElement;
    if (target) {
      this.centerOnBoard(target);
    }
  }

  private updateActiveTimelineTracker() {
    if (this.isAnimatingPan() || !this.mainArea) return;

    const boards = Array.from(document.querySelectorAll('app-month-board > div')) as HTMLElement[];
    if (boards.length === 0) return;

    const viewportRect = this.mainArea.nativeElement.getBoundingClientRect();
    const screenCenterX = viewportRect.left + viewportRect.width / 2;
    const screenCenterY = viewportRect.top + viewportRect.height / 2;

    let closestIdx = 0;
    let minDiff = Infinity;

    // Batch read and calculate to avoid layout thrashing
    for (let i = 0; i < boards.length; i++) {
      const bRect = boards[i].getBoundingClientRect();
      const bCenterX = bRect.left + bRect.width / 2;
      const bCenterY = bRect.top + bRect.height / 2;

      const diff = Math.sqrt(
        Math.pow(bCenterX - screenCenterX, 2) + Math.pow(bCenterY - screenCenterY, 2),
      );

      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    if (this.store.activeTimelineIndex() !== closestIdx) {
      this.store.setActiveTimelineIndex(closestIdx);
    }
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    if (this.isAnimatingPan()) this.isAnimatingPan.set(false);

    if (e.ctrlKey || e.metaKey) {
      const zoomIntensity = 0.0075;
      const zoomFactor = Math.exp(-e.deltaY * zoomIntensity);
      const newScale = Math.min(Math.max(0.05, this.scale() * zoomFactor), 4);

      const rect = this.mainArea.nativeElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newPanX = mouseX - (mouseX - this.panX()) * (newScale / this.scale());
      const newPanY = mouseY - (mouseY - this.panY()) * (newScale / this.scale());

      this.panX.set(newPanX);
      this.panY.set(newPanY);
      this.scale.set(newScale);
    } else {
      this.panX.set(this.panX() - e.deltaX);
      this.panY.set(this.panY() - e.deltaY);
    }
    this.updateTransform();
  }

  onKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.hasAttribute('contenteditable')) return;

    if (e.shiftKey) {
      if (e.key === '!') this.zoomToFitAll();
      else if (e.key === '@') this.jumpToLatestMonth();
      else if (e.key.toLowerCase() === 'n') this.zoomToNextFrame();
    }
  }

  zoomToFitAll() {
    const wrapper = document.getElementById('canvas-wrapper');
    if (!wrapper) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const width = wrapper.scrollWidth;
    const height = wrapper.scrollHeight;
    const padding = 100;

    let newScale = (screenW - padding) / width;
    const heightScale = (screenH - padding) / height;
    newScale = Math.min(newScale, heightScale, 1);

    this.scale.set(newScale);
    const targetPanX = (screenW - width * newScale) / 2;
    const targetPanY = (screenH - height * newScale) / 2;

    this.isAnimatingPan.set(true);
    this.panX.set(targetPanX);
    this.panY.set(targetPanY);
    this.updateTransform();
    setTimeout(() => this.isAnimatingPan.set(false), 550);
  }

  jumpToLatestMonth(animate = true) {
    const boards = document.querySelectorAll('app-month-board > div');
    const lastBoard = boards[boards.length - 1] as HTMLElement;
    if (lastBoard) {
      this.centerOnBoard(lastBoard, animate);
    }
  }

  zoomToNextFrame() {
    const boards = Array.from(document.querySelectorAll('app-month-board > div')) as HTMLElement[];
    const screenCenterX = window.innerWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    const s = this.scale();
    const px = this.panX();

    boards.forEach((b, idx) => {
      const boardCenterScreenX = (b.offsetLeft + b.offsetWidth / 2) * s + px;
      const diff = Math.abs(boardCenterScreenX - screenCenterX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx < boards.length - 1) {
      this.centerOnBoard(boards[closestIdx + 1]);
    } else {
      this.addMonth();
    }
  }

  centerOnBoard(board: HTMLElement, animate = true) {
    const startScale = 0.28;
    const viewport = this.mainArea.nativeElement;
    const viewW = viewport.clientWidth;
    const viewH = viewport.clientHeight;
    const bWidth = board.offsetWidth;
    const bHeight = board.offsetHeight;

    let offsetL = 0;
    let offsetT = 0;
    let el: HTMLElement | null = board;
    const wrapper = viewport.querySelector('#canvas-wrapper') as HTMLElement;

    while (el && el !== wrapper) {
      offsetL += el.offsetLeft;
      offsetT += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }

    const { targetPanX, targetPanY } = calculateCenteringCoordinates(
      viewW,
      viewH,
      bWidth,
      bHeight,
      offsetL,
      offsetT,
      startScale,
    );

    this.scale.set(startScale);
    if (animate) {
      this.isAnimatingPan.set(true);
      this.panX.set(targetPanX);
      this.panY.set(targetPanY);
      setTimeout(() => this.isAnimatingPan.set(false), 550);
    } else {
      this.isAnimatingPan.set(false);
      this.panX.set(targetPanX);
      this.panY.set(targetPanY);
    }
    this.updateTransform();
  }

  onMouseDown(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('.interactive-element') || target.hasAttribute('contenteditable')) return;
    if (this.isAnimatingPan()) this.isAnimatingPan.set(false);
    this.isPanningCanvas.set(true);
    this.startX = e.clientX - this.panX();
    this.startY = e.clientY - this.panY();
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isPanningCanvas()) return;
    this.panX.set(e.clientX - this.startX);
    this.panY.set(e.clientY - this.startY);
    this.updateTransform();
  }

  private onMouseUp() {
    if (this.isPanningCanvas()) this.isPanningCanvas.set(false);
  }

  private onResize() {
    // Handle screen resize, centering might need adjustment but usually stays relative
  }

  onDocumentClick() {
    if (this.store.activeMenuId()) this.store.setActiveMenuId(null);
    if (this.store.isTimelineOpen()) this.store.toggleTimeline();
  }

  toggleTimeline(evt: Event) {
    evt.stopPropagation();
    this.store.toggleTimeline();
  }

  toggleFlowPanel(evt: Event) {
    evt.stopPropagation();
    this.store.toggleFlowPanel();
  }

  openAddModal(evt: Event) {
    evt.stopPropagation();
    this.store.openAddModal(this.store.months().length - 1);
  }

  openChartsModal(evt?: Event) {
    if (evt) evt.stopPropagation();
    this.store.toggleCharts(true);
  }

  openVisualizeModal() {
    this.chartsModal?.open();
  }

  openSettings() {
    this.store.setSettingsOpen(true);
  }

  openCompareModal(evt?: Event) {
    if (evt) evt.stopPropagation();
    this.store.openCompareModal();
  }

  addMonth(event?: Event) {
    if (event) event.stopPropagation();
    this.store.duplicateMonth(this.store.months().length - 1);

    setTimeout(() => {
      const boards = document.querySelectorAll('app-month-board > div');
      const lastBoard = boards[boards.length - 1] as HTMLElement;
      if (lastBoard) this.centerOnBoard(lastBoard);
    }, 50);
  }

  exportData() {
    this.store.exportData();
  }

  async importData(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.isCanvasReady.set(false);
      await this.store.importData(input.files[0]);
      input.value = '';
      setTimeout(() => this.jumpToLatestMonth(false), 500);
    }
  }

  unloadData() {
    this.store.unloadData();
  }

  createFreshPortfolio() {
    this.store.createFreshPortfolio();
  }

  getMonthColumn(dateStr: string): number {
    const m = dateStr.trim().split(' ')[0].toLowerCase();
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];
    const idx = months.findIndex((name) => name.startsWith(m));
    return idx !== -1 ? idx + 2 : 2;
  }

  getMissingMonthIndices(group: { items: { month: { date: string } }[] }): number[] {
    const presentIndices = group.items.map((it) => this.getMonthColumn(it.month.date) - 1);
    const missing: number[] = [];
    for (let i = 1; i <= 12; i++) {
      if (!presentIndices.includes(i)) missing.push(i);
    }
    return missing;
  }

  getMonthNameFromIndex(idx: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[idx - 1] || 'Unknown';
  }

  addSpecificMonth(year: number, monthIdx: number) {
    const monthName = this.getMonthNameFromIndex(monthIdx);
    const dateStr = `${monthName} ${year}`;
    const exists = this.store.months().some((m) => m.date === dateStr);
    if (exists) return;

    const sortedMonths = [...this.store.months()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const targetDate = new Date(`${monthName} 1, ${year}`);
    let sourceIdx = this.store.months().length - 1;

    for (const m of sortedMonths) {
      if (new Date(m.date) < targetDate) {
        sourceIdx = this.store.months().findIndex((orig) => orig.id === m.id);
        break;
      }
    }
    this.store.duplicateMonth(sourceIdx, dateStr);

    setTimeout(() => {
      const boards = document.querySelectorAll('app-month-board > div');
      const newIdx = this.store.months().findIndex((m) => m.date === dateStr);
      const targetBoard = boards[newIdx] as HTMLElement;
      if (targetBoard) this.centerOnBoard(targetBoard);
    }, 50);
  }
}
