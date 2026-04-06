import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  signal,
  effect,
  ChangeDetectorRef,
  computed,
  viewChild,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { FinanceStore, formatHumanUSD } from '../../store/finance.store';
import { hslToHex } from '../../utils/color.util';

@Component({
  selector: 'app-add-asset-modal',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-asset-modal.component.html',
  host: {
    '(window:mouseup)': 'endDrag()',
    '(window:touchend)': 'endDrag()',
    '(window:keydown.enter)': 'onEnter()',
  },
})
export class AddAssetModalComponent {
  store = inject(FinanceStore);
  cdr = inject(ChangeDetectorRef);

  assetName = '';
  assetAmount: number | null = null;
  flowCategory = 'fixed';
  customFlowCategory = '';
  availableColors = [
    'bg-asset-green',
    'bg-asset-purple',
    'bg-asset-blue',
    'bg-asset-sand',
    'bg-asset-rose',
    'bg-asset-teal',
    'bg-asset-stone',
  ];

  readonly colorCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('colorCanvas');
  readonly wheelContainer = viewChild.required<ElementRef<HTMLDivElement>>('wheelContainer');
  readonly nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');
  readonly otherInput = viewChild.required<ElementRef<HTMLInputElement>>('otherInput');

  targetX = signal<number>(80);
  targetY = signal<number>(80);

  isDragging = false;

  customExpenseCategories = computed(() => {
    const categories = new Set<string>();
    const flow = this.store.months()[this.store.activeModalMonthIndex()].flow;
    flow.forEach((f) => {
      if (f.parentCategory === 'expense' && f.type !== 'fixed' && f.type !== 'flexible') {
        categories.add(f.type);
      }
    });
    return Array.from(categories);
  });

  customSavingsCategories = computed(() => {
    const categories = new Set<string>();
    const flow = this.store.months()[this.store.activeModalMonthIndex()].flow;
    flow.forEach((f) => {
      if (f.parentCategory === 'savings' && f.type !== 'general') {
        categories.add(f.type);
      }
    });
    return Array.from(categories);
  });

  constructor() {
    effect(() => {
      if (this.store.isAddModalOpen() && this.store.addModalMode() === 'palette') {
        this.assetName = '';
        this.assetAmount = null;
        // Auto-focus the name field for quick entry
        setTimeout(() => this.nameInput()?.nativeElement?.focus(), 80);
      }
      if (this.store.isAddModalOpen()) {
        if (this.store.addModalType() === 'flow-expense') {
          this.flowCategory = 'fixed';
          this.customFlowCategory = '';
        }
        if (this.store.addModalType() === 'flow-savings') {
          this.flowCategory = 'general';
          this.customFlowCategory = '';
        }
        this.cdr.markForCheck();

        if (this.store.addModalMode() === 'custom') {
          setTimeout(() => {
            if (this.colorCanvas()) {
              this.initColorWheel();
              this.centerTarget();
            }
          }, 50);
        }
      }
    });
  }

  getPaletteClass(color: string): string {
    const isSelected = this.store.newAssetColor() === color;
    const base = color.startsWith('bg-') ? color : '';
    if (isSelected) {
      return base + ' ring-4 ring-offset-2 ring-slate scale-110 shadow-md';
    }
    return base + ' hover:scale-110 opacity-70 hover:opacity-100';
  }

  openCustom() {
    this.store.setAddModalMode('custom');
  }

  initColorWheel() {
    const canvas = this.colorCanvas().nativeElement;
    const radius = 80;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    for (let angle = 0; angle <= 360; angle++) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, startAngle, endAngle);
      ctx.closePath();
      const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      gradient.addColorStop(0, `hsl(${angle}, 0%, 50%)`);
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  centerTarget() {
    this.targetX.set(80);
    this.targetY.set(80);
  }

  handleInteract(e: MouseEvent | TouchEvent) {
    if (e.type === 'mousedown' || e.type === 'touchstart') this.isDragging = true;
    if (!this.isDragging && e.type !== 'click') return;
    e.preventDefault();

    const container = this.wheelContainer().nativeElement;
    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const radius = rect.width / 2;
    let x = clientX - rect.left - radius;
    let y = clientY - rect.top - radius;

    const distance = Math.sqrt(x * x + y * y);
    if (distance > radius) {
      x = x * (radius / distance);
      y = y * (radius / distance);
    }

    let angle = Math.atan2(y, x);
    if (angle < 0) angle += 2 * Math.PI;
    const hue = Math.round((angle * 180) / Math.PI);
    const sat = Math.round((Math.min(distance, radius) / radius) * 100);

    const hex = hslToHex(hue, sat, 50);
    this.store.setTempCustomColor(hex);

    this.targetX.set(x + radius);
    this.targetY.set(y + radius);
  }

  // Handle outside events
  endDrag() {
    this.isDragging = false;
  }

  onEnter() {
    if (this.store.isAddModalOpen()) {
      this.confirmCreate();
    }
  }

  confirmCreate() {
    if (this.store.addModalType().startsWith('flow')) {
      const parentCategory = this.store.addModalType() === 'flow-savings' ? 'savings' : 'expense';
      const finalType =
        this.flowCategory === 'other' ? this.customFlowCategory || 'general' : this.flowCategory;
      this.store.confirmAddFlow(
        this.assetName,
        this.assetAmount || 0,
        finalType.toLowerCase(),
        parentCategory,
      );
    } else {
      this.store.confirmAddAsset(this.assetName, this.assetAmount || 0);
    }
  }

  selectFlowCategory(cat: string) {
    this.flowCategory = cat;
    if (cat === 'other') {
      setTimeout(() => this.otherInput()?.nativeElement?.focus(), 50);
    }
  }

  formatUSD(val: number): string {
    return formatHumanUSD(val, this.store.marbleMultiplier());
  }
}
