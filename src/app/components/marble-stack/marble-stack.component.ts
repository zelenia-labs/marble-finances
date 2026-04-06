import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';
import { FinanceStore, formatHumanUSD } from '../../store/finance.store';
import { getColorProps, getPreviewStyle } from '../../utils/color.util';

export interface GridSlot {
  idx: number;
  value: number; // For rendering 1 to 25
  activeRemaining: number;
  baseValue: number; // Value representing what's below this grid
  x: number; // Relative to the dynamic grid group
  y: number; // Relative to the dynamic grid group
}

export interface RenderElement {
  type: 'viginti' | 'deca' | 'penta' | 'grid';
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

@Component({
  selector: 'app-marble-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marble-stack.component.html',
  host: {
    '(mousedown)': '$event.stopPropagation()',
  },
})
export class MarbleStackComponent {
  val = input.required<number>();
  color = input.required<string>();
  simple = input<boolean>(false);
  size = input<number>(5);
  useThresholdRounding = input<boolean>(false);
  maxTier = input<'penta' | 'viginti'>('viginti');

  amountChanged = output<number>();
  store = inject(FinanceStore);
  tooltip = inject(TooltipService);

  hoveredSlotIdx = signal<number | null>(null);
  hoveredIsHalf = signal<boolean>(false);
  celebratingPentaBlockIdx = signal<number | null>(null);
  celebratingDecaBlockIdx = signal<number | null>(null);
  celebratingVigintiBlockIdx = signal<number | null>(null);

  private prevPentaBlocksCount = 0;
  private prevDecaBlocksCount = 0;
  private prevVigintiBlocksCount = 0;
  private celebratePentaTimer: ReturnType<typeof setTimeout> | null = null;
  private celebrateDecaTimer: ReturnType<typeof setTimeout> | null = null;
  private celebrateVigintiTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const current = this.pentaMarbleBlocksCount();
      if (current > this.prevPentaBlocksCount) {
        if (this.celebratePentaTimer) clearTimeout(this.celebratePentaTimer);
        this.celebratingPentaBlockIdx.set(current - 1);
        this.celebratePentaTimer = setTimeout(() => this.celebratingPentaBlockIdx.set(null), 1080);
      }
      this.prevPentaBlocksCount = current;
    });

    effect(() => {
      const current = this.decaMarbleBlocksCount();
      if (current > this.prevDecaBlocksCount) {
        if (this.celebrateDecaTimer) clearTimeout(this.celebrateDecaTimer);
        this.celebratingDecaBlockIdx.set(current - 1);
        this.celebrateDecaTimer = setTimeout(() => this.celebratingDecaBlockIdx.set(null), 1080);
      }
      this.prevDecaBlocksCount = current;
    });

    effect(() => {
      const current = this.vigintiMarbleBlocksCount();
      if (current > this.prevVigintiBlocksCount) {
        if (this.celebrateVigintiTimer) clearTimeout(this.celebrateVigintiTimer);
        this.celebratingVigintiBlockIdx.set(current - 1);
        this.celebrateVigintiTimer = setTimeout(() => this.celebratingVigintiBlockIdx.set(null), 1080);
      }
      this.prevVigintiBlocksCount = current;
    });
  }

  colorPropsFull = computed(() => getColorProps(this.color(), 'full'));
  colorPropsShadow = computed(() => getColorProps(this.color(), 'shadow'));

  // A Viginti block represents 400 units (20x20 blocks)
  vigintiMarbleBlocksCount = computed(() => {
    if (this.maxTier() === 'penta') return 0;
    return Math.floor(this.val() / 400);
  });
  vigintiMarbleBlocks = computed(() => Array(this.vigintiMarbleBlocksCount()).fill(0));

  remainderAfterViginti = computed(() => {
    if (this.maxTier() === 'penta') return this.val();
    return this.val() % 400;
  });

  // A Deca block represents 100 units (10x10 blocks)
  decaMarbleBlocksCount = computed(() => {
    if (this.maxTier() === 'penta') return 0;
    return Math.floor(this.remainderAfterViginti() / 100);
  });
  decaMarbleBlocks = computed(() => Array(this.decaMarbleBlocksCount()).fill(0));

  remainderAfterDeca = computed(() => {
    if (this.maxTier() === 'penta') return this.val();
    return this.remainderAfterViginti() % 100;
  });
  currentAccounted = computed(() => this.val() - this.remainderAfterDeca());

  pageSize = computed(() => this.size() * this.size()); // Default 25 for 5x5

  pentaMarbleBlocksCount = computed(() => Math.floor(this.remainderAfterDeca() / this.pageSize()));
  pentaMarbleBlocks = computed(() => Array(this.pentaMarbleBlocksCount()).fill(0));

  remainder = computed(() => this.remainderAfterDeca() % this.pageSize());

  showMarbleBox = computed(() => this.remainder() > 0 || this.val() === 0);
  
  stackWidth = computed(() => {
    if (this.maxTier() === 'penta') return 'narrow';
    if (this.simple()) return 'narrow';
    if (this.vigintiMarbleBlocksCount() > 0 || this.decaMarbleBlocksCount() > 0 || this.pentaMarbleBlocksCount() > 1) return 'wide'; // 636
    return 'narrow';
  });

  showGrid = computed(() => true);
  activeRemaining = computed(() => {
    const raw = this.remainder() % this.pageSize();
    if (!this.useThresholdRounding() || raw === 0) return raw;

    const whole = Math.floor(raw);
    const fract = raw - whole;

    if (fract < 0.0001) return whole;

    if (fract <= 0.5001) return whole + 0.5;
    return whole + 1;
  });
  baseForGrid = computed(() => this.currentAccounted() + this.pentaMarbleBlocksCount() * this.pageSize());

  marbleRows = computed(() => {
    if (this.simple()) {
      const active = this.activeRemaining();
      return Math.floor(active / this.size()) + 1;
    }
    return this.size();
  });

  gridSlots = computed(() => {
    const slots: GridSlot[] = [];
    const active = this.activeRemaining();
    const base = this.baseForGrid();
    const size = this.size();
    const rows = this.marbleRows();

    for (let row = rows - 1; row >= 0; row--) {
      for (let col = 0; col < size; col++) {
        const slotIdx = row * size + col;
        slots.push({
          idx: slotIdx,
          value: slotIdx + 1,
          activeRemaining: active,
          baseValue: base,
          x: col * 32,
          y: (rows - 1 - row) * 32,
        });
      }
    }
    return slots;
  });

  getSlotFill(slot: GridSlot): string {
    return this.getColorStyleVal(slot);
  }

  getColorStyleVal(slot: GridSlot): string {
    const val = slot.activeRemaining >= slot.value 
      ? this.colorPropsFull().val 
      : this.colorPropsShadow().val;
    return val || (this.color().startsWith('#') ? this.color() : 'var(--color-slate)');
  }

  isHalf(slot: GridSlot): boolean {
    return slot.activeRemaining === slot.value - 0.5;
  }

  isGhost(slot: GridSlot): boolean {
    return slot.activeRemaining < slot.value;
  }

  isGhostInHoverRange(slot: GridSlot): boolean {
    if (!this.isGhost(slot)) return false;
    const hovered = this.hoveredSlotIdx();
    if (hovered === null) return false;
    const firstNonFullIdx = Math.floor(slot.activeRemaining);
    return slot.idx >= firstNonFullIdx && slot.idx <= hovered;
  }

  previewStyle = computed(() => getPreviewStyle(this.color()));
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
    const isHalfPos = evt.clientX - rect.left < rect.width / 2;
    return slot.baseValue + slot.idx + (isHalfPos ? 0.5 : 1);
  }

  onSlotEnter(evt: MouseEvent, slot: GridSlot) {
    if (this.isGhost(slot)) {
      this.hoveredSlotIdx.set(slot.idx);
      const target = evt.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.hoveredIsHalf.set(evt.clientX - rect.left < rect.width / 2);
    }
  }

  onSlotMouseMove(evt: MouseEvent, slot: GridSlot) {
    const target = evt.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isHalfPos = evt.clientX - rect.left < rect.width / 2;

    if (this.isGhost(slot)) {
      this.hoveredSlotIdx.set(slot.idx);
      this.hoveredIsHalf.set(isHalfPos);
    }
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
      isHalfClick = evt.clientX - rect.left < rect.width / 2;
    }
    const updatedVal = slot.baseValue + slot.idx + (isHalfClick ? 0.5 : 1);
    this.amountChanged.emit(updatedVal);
  }

  allElements = computed(() => {
    const list: RenderElement[] = [];
    let currentY = 0;
    const gap = 4;
    const blockSide = this.size() * 32 - 4; // Penta side (156)
    const decaSide = 10 * 32 - 4; // Deca side (316)
    const vigintiSide = 20 * 32 - 4; // Viginti side (636)
    const showGrid = this.showGrid() || this.simple();

    // 1. Viginti Blocks (Foundation tier - 1 per row, Full 636px Width)
    this.vigintiMarbleBlocks().forEach((_, i) => {
      list.push({ 
        type: 'viginti', 
        x: 0, 
        y: currentY, 
        width: vigintiSide, 
        height: vigintiSide, 
        id: `viginti-${i}` 
      });
      currentY += vigintiSide + gap;
    });

    // 2. Prepare Deca Cells (Max 2 per row in the 636px column)
    const decaCells: RenderElement[][] = [];

    // Real Deca blocks (100s)
    this.decaMarbleBlocks().forEach((_, i) => {
      decaCells.push([{
        type: 'deca',
        x: 0,
        y: 0,
        width: decaSide,
        height: decaSide,
        id: `deca-${i}`
      }]);
    });

    // Sub-Cell: Penta/Grid
    const smallItems: RenderElement[] = [];
    let curSmallX = 0;
    let curSmallY = 0;
    let maxSmallRowH = 0;

    let lastWasMaxTier = false;
    const addSmall = (type: 'penta' | 'grid', w: number, h: number, id: string) => {
      const isMaxTier = type === (this.maxTier() as string);
      if (curSmallX > 0 && (isMaxTier || lastWasMaxTier || curSmallX + w > decaSide + 1)) {
        curSmallX = 0;
        curSmallY += maxSmallRowH + gap;
        maxSmallRowH = 0;
      }
      smallItems.push({ type, x: curSmallX, y: curSmallY, width: w, height: h, id });
      maxSmallRowH = Math.max(maxSmallRowH, h);
      curSmallX += w + gap;
      lastWasMaxTier = isMaxTier;
    };

    this.pentaMarbleBlocks().forEach((_, i) => addSmall('penta', blockSide, blockSide, `penta-${i}`));
    if (showGrid) {
      addSmall('grid', blockSide, this.marbleRows() * 32 - 4, 'grid');
    }

    if (smallItems.length > 0) {
      decaCells.push(smallItems);
    }

    // Wrap Deca cells into rows (max 2 per row) within the 636px column
    const maxDecaPerRow = 2;
    decaCells.forEach((cell, i) => {
      const row = Math.floor(i / maxDecaPerRow);
      const col = i % maxDecaPerRow;
      const cellOffX = col * (decaSide + gap);
      const cellOffY = currentY + row * (decaSide + gap);

      cell.forEach(item => {
        list.push({
          ...item,
          x: cellOffX + item.x,
          y: cellOffY + item.y
        });
      });
    });

    // Flip coordinates for bottom-up growth
    const totalH = Math.max(0, ...list.map(e => e.y + e.height));
    return list.map(el => ({ ...el, y: totalH - el.y - el.height } as RenderElement));
  });

  totalSvgWidth = computed(() => {
    const sw = this.stackWidth();
    if (sw === 'wide') return 636;
    return 316;
  });

  totalSvgHeight = computed(() => {
    const els = this.allElements();
    if (els.length === 0) return 0;
    return Math.max(...els.map(e => e.y + e.height));
  });

  getGridStyle() {
    return {
      width: `${this.totalSvgWidth()}px`,
      height: `${this.totalSvgHeight()}px`,
    };
  }
}
