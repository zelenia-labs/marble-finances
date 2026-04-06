import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';
import { FinanceStore, formatHumanUSD } from '../../store/finance.store';
import { getColorProps, getPreviewStyle } from '../../utils/color.util';

export interface GridSlot {
  idx: number;
  value: number; // For rendering 1 to 25
  activeRemaining: number;
  baseValue: number; // Value representing what's below this grid
}

@Component({
  selector: 'app-marble-stack',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marble-stack.component.html',
  host: {
    '(mousedown)': '$event.stopPropagation()'
  }
})
export class MarbleStackComponent {
  val = input.required<number>();
  color = input.required<string>();
  simple = input<boolean>(false);
  size = input<number>(5);
  useThresholdRounding = input<boolean>(false);

  amountChanged = output<number>();
  store = inject(FinanceStore);
  tooltip = inject(TooltipService);

  hoveredSlotIdx = signal<number | null>(null);
  hoveredIsHalf = signal<boolean>(false);
  celebratingBigBlockIdx = signal<number | null>(null);
  celebratingHugeBlockIdx = signal<number | null>(null);

  private prevBigBlocksCount = 0;
  private prevHugeBlocksCount = 0;
  private celebrateTimer: ReturnType<typeof setTimeout> | null = null;
  private celebrateHugeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const current = this.bigMarblesCount();
      if (current > this.prevBigBlocksCount) {
        const newIdx = current - 1;
        if (this.celebrateTimer) clearTimeout(this.celebrateTimer);
        this.celebratingBigBlockIdx.set(newIdx);
        this.celebrateTimer = setTimeout(() => this.celebratingBigBlockIdx.set(null), 1080);
      }
      this.prevBigBlocksCount = current;
    });

    effect(() => {
      const current = this.hundredsCount();
      if (current > this.prevHugeBlocksCount) {
        // A 100-unit huge block was just formed — celebrate it!
        // Always target index 0: the topmost huge block, directly below the ghost grid,
        // which is where the user just completed the consolidation.
        if (this.celebrateHugeTimer) clearTimeout(this.celebrateHugeTimer);
        this.celebratingHugeBlockIdx.set(0);
        this.celebrateHugeTimer = setTimeout(() => this.celebratingHugeBlockIdx.set(null), 1080);
      }
      this.prevHugeBlocksCount = current;
    });
  }

  colorPropsFull = computed(() => getColorProps(this.color(), 'full'));
  colorPropsShadow = computed(() => getColorProps(this.color(), 'shadow'));

  hundredsCount = computed(() => Math.floor(this.val() / 100));
  hugeMarbles = computed(() => Array(this.hundredsCount()).fill(0));

  remainder = computed(() => this.val() % 100);
  currentAccounted = computed(() => this.val() - this.remainder());

  pageSize = computed(() => this.size() * this.size());

  bigMarblesCount = computed(() => Math.floor(this.remainder() / this.pageSize()));
  bigMarbles = computed(() => Array(this.bigMarblesCount()).fill(0));

  showMarbleBox = computed(() => this.remainder() > 0 || this.val() === 0);
  stackWidth = computed(() => (!this.simple() && this.bigMarblesCount() > 0 ? 'wide' : 'narrow'));

  showGrid = computed(() => true);
  activeRemaining = computed(() => {
    const raw = this.remainder() % this.pageSize();
    if (!this.useThresholdRounding() || raw === 0) return raw;

    const whole = Math.floor(raw);
    const fract = raw - whole;

    if (fract < 0.0001) return whole;

    // RULE:
    // If number is UNDER half the block's amount (0.5), fill until half.
    // If number is OVER half the block's amount (0.5), fill entire block.
    if (fract <= 0.5001) return whole + 0.5;
    return whole + 1;
  });
  baseForGrid = computed(() => this.currentAccounted() + (this.bigMarblesCount() * this.pageSize()));

  marbleRows = computed(() => {
    if (this.simple()) {
      const active = this.activeRemaining();
      // Always provide an empty row if the current one is full
      return Math.floor(active / this.size()) + 1;
    }
    // Asset Categories always show the full square context
    return this.size();
  });

  gridSlots = computed(() => {
    const slots: GridSlot[] = [];
    const active = this.activeRemaining();
    const base = this.baseForGrid();
    const size = this.size();
    const rows = this.marbleRows();

    // Render only the rows we need
    for (let row = rows - 1; row >= 0; row--) {
      for (let col = 0; col < size; col++) {
        const slotIdx = row * size + col;
        slots.push({
          idx: slotIdx,
          value: slotIdx + 1,
          activeRemaining: active,
          baseValue: base
        });
      }
    }
    return slots;
  });

  getSlotClass(slot: GridSlot): string {
    if (slot.activeRemaining >= slot.value) {
      return this.colorPropsFull().cls;
    } else if (slot.activeRemaining === slot.value - 0.5) {
      return 'bg-gray-100';
    } else {
      return this.colorPropsShadow().cls;
    }
  }

  getSlotStyle(slot: GridSlot): string {
    if (slot.activeRemaining >= slot.value) {
      return this.colorPropsFull().stl;
    } else if (slot.activeRemaining === slot.value - 0.5) {
      return '';
    } else {
      return this.colorPropsShadow().stl;
    }
  }

  isHalf(slot: GridSlot): boolean {
    return slot.activeRemaining === slot.value - 0.5;
  }

  isGhost(slot: GridSlot): boolean {
    return slot.activeRemaining < slot.value && !this.isHalf(slot);
  }

  /** Returns true when this ghost slot is between the last active slot and the hovered slot. */
  isGhostInHoverRange(slot: GridSlot): boolean {
    if (!this.isGhost(slot)) return false;
    const hovered = this.hoveredSlotIdx();
    if (hovered === null) return false;
    // The hover range starts at the very first index that is NOT fully filled.
    // slot.activeRemaining represents the solid count. idx 5 is marble 6.
    const firstNonFullIdx = Math.floor(slot.activeRemaining);
    return slot.idx >= firstNonFullIdx && slot.idx <= hovered;
  }

  /** Returns an inline rgba background at 40% opacity for this category's colour. */
  previewStyle = computed(() => getPreviewStyle(this.color()));

  /** Returns an inline rgba background at 70% opacity for the hovered ghost slot. */
  previewStyleStrong = computed(() => getPreviewStyle(this.color(), 0.7));

  formatUSD(val: number): string {
    return formatHumanUSD(val, this.store.marbleMultiplier());
  }

  showTooltip(evt: MouseEvent, label: string) {
    this.tooltip.show(evt, label);
  }

  hideTooltip() {
    this.tooltip.hide();
  }

  getHoverValue(evt: MouseEvent, slot: GridSlot): number {
    const target = evt.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isHalfPos = (evt.clientX - rect.left) < (rect.width / 2);
    return slot.baseValue + slot.idx + (isHalfPos ? 0.5 : 1);
  }

  onSlotEnter(evt: MouseEvent, slot: GridSlot) {
    if (this.isGhost(slot)) {
      this.hoveredSlotIdx.set(slot.idx);
      const target = evt.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.hoveredIsHalf.set((evt.clientX - rect.left) < (rect.width / 2));
    }
  }

  onSlotMouseMove(evt: MouseEvent, slot: GridSlot) {
    const target = evt.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isHalfPos = (evt.clientX - rect.left) < (rect.width / 2);

    if (this.isGhost(slot)) {
      this.hoveredSlotIdx.set(slot.idx);
      this.hoveredIsHalf.set(isHalfPos);
    }

    // Update tooltip as well
    this.showTooltip(evt, this.formatUSD(this.getHoverValue(evt, slot)));
  }

  onGridLeave() {
    this.hoveredSlotIdx.set(null);
  }

  onBlockClick(newAmount: number) {
    this.amountChanged.emit(newAmount);
  }

  onSlotClick(evt: Event, slot: GridSlot) {
    let isHalfClick = false;
    if (evt instanceof MouseEvent) {
      const target = evt.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      isHalfClick = (evt.clientX - rect.left) < (rect.width / 2);
    }

    // Value equals base blocks total + slot index + (half or full addition)
    const updatedVal = slot.baseValue + slot.idx + (isHalfClick ? 0.5 : 1);
    this.amountChanged.emit(updatedVal);
  }

  getBigBlockStyle = computed(() => {
    const size = this.size();
    const marbleRows = size;
    return {
      'width.px': size * 32 - 4,
      'height.px': marbleRows * 32 - 4
    };
  });

  getGridStyle = computed(() => {
    const size = this.size();
    const rows = this.marbleRows();
    return {
      'grid-template-columns': `repeat(${size}, minmax(0, 1fr))`,
      'width.px': size * 32 - 4,
      'height.px': rows * 32 - 4
    };
  });
}
