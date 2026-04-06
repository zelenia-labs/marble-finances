// @vitest-environment jsdom
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { By } from '@angular/platform-browser';
import { TooltipService } from '../../services/tooltip.service';
import { FinanceStore } from '../../store/finance.store';
import { MarbleStackComponent } from './marble-stack.component';

import { beforeEach, describe, expect, it, vi } from 'vitest';

try {
  TestBed.initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting()
  );
} catch {
  // already initialized
}

describe('MarbleStackComponent — Regression Tests', () => {
  let fixture: ComponentFixture<MarbleStackComponent>;
  let mockStore: unknown;

  beforeEach(async () => {
    mockStore = {
      marbleMultiplier: signal(1000),
      assetsGridSize: signal(5),
      flowGridSize: signal(5),
      currentAccounted: signal(0),
      months: signal([]),
    };

    // Fix ReferenceError: localStorage is not defined in Vitest
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [MarbleStackComponent],
      providers: [
        { provide: FinanceStore, useValue: mockStore },
        { provide: TooltipService, useValue: { show: () => { /* no-op */ }, hide: () => { /* no-op */ } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MarbleStackComponent);

    // Set required inputs
    fixture.componentRef.setInput('val', 0);
    fixture.componentRef.setInput('color', 'bg-assetBlue');

    fixture.detectChanges();
  });

  it('should render 1 Penta Marble Block when value reaches 25 (with grid size 5)', () => {
    // 25 marbles = 1 full 5x5 block
    fixture.componentRef.setInput('val', 25);
    fixture.componentRef.setInput('size', 5);
    fixture.detectChanges();

    // The penta marble blocks have data-type="penta"
    const allPentaBlocks = fixture.debugElement.queryAll(By.css('[data-type="penta"]'));
    expect(allPentaBlocks.length).toBe(1);

    const rect = allPentaBlocks[0].nativeElement.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect!.getAttribute('width')).toBe('156'); // (5 * 32) - 4
    expect(rect!.getAttribute('height')).toBe('156');
    expect(rect!.getAttribute('fill')).toContain('var(--color-marble-asset-blue)');
  });

  it('should render 2 Penta Marble Blocks when value reaches 50', () => {
    fixture.componentRef.setInput('val', 50);
    fixture.componentRef.setInput('size', 5);
    fixture.detectChanges();

    const allPentaBlocks = fixture.debugElement.queryAll(By.css('[data-type="penta"]'));
    expect(allPentaBlocks.length).toBe(2);
  });

  it('should render a Deca Marble Block when value reaches 100', () => {
    fixture.componentRef.setInput('val', 100);
    fixture.detectChanges();

    const decaBlock = fixture.debugElement.query(By.css('[data-type="deca"]'));
    expect(decaBlock).toBeTruthy();

    const rect = decaBlock.nativeElement.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect!.getAttribute('width')).toBe('316');
    expect(rect!.getAttribute('fill')).toContain('var(--color-marble-asset-blue)');
  });

  it('should handle non-asset colors (flow blocks)', () => {
    fixture.componentRef.setInput('val', 400); // 1 Viginti
    fixture.componentRef.setInput('color', 'bg-flow-orange');
    fixture.detectChanges();

    const vigintiBlock = fixture.debugElement.query(By.css('[data-type="viginti"]'));
    const rect = vigintiBlock.nativeElement.querySelector('rect');
    expect(rect!.getAttribute('fill')).toContain('var(--color-flow-orange)');
  });

  it('should render dynamic grid when value is not a clean multiple of page size', () => {
    // 3 marbles = grid with 3 active slots
    fixture.componentRef.setInput('val', 3);
    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.css('[data-type="grid"]'));
    expect(grid).toBeTruthy();

    const allRects = grid.nativeElement.querySelectorAll('rect');
    // For size 5, grid is 5x5 = 25 rects
    expect(allRects.length).toBe(25);
  });
  describe('Layout — Orphan Prevention', () => {
    it('should position the dynamic grid next to a Deca block when space allows ($125)', () => {
      // 125 units = 1 Deca (100) + 1 Grid (25)
      // Deca width: 316. Grid width: 156. Total available: 1276.
      fixture.componentRef.setInput('val', 125);
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const deca = els.find(e => e.id.startsWith('deca'));
      const penta = els.find(e => e.id.startsWith('penta'));
      const grid = els.find(e => e.type === 'grid');

      expect(deca).toBeTruthy();
      expect(penta).toBeTruthy();
      expect(grid).toBeTruthy();
      
      // Use top-edge alignment for bottom-up stacking
      expect(deca!.y + deca!.height).toBe(grid!.y + grid!.height);
      
      // In 2rd wide model: Deca @ 0, [Penta @ 320, Grid @ 480]
      expect(penta!.x).toBe(320);
      expect(grid!.x).toBe(penta!.x + penta!.width + 4);
    });

    it('should consolidate Viginti, Deca, Penta, and Grid on a single row above foundation ($1730)', () => {
      // 1730 units = 4 Viginti (1600) + 1 Deca (100) + 1 Penta (25) + 5 Grid
      fixture.componentRef.setInput('val', 1730);
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const viginti = els.find(e => e.type === 'viginti');
      const deca = els.find(e => e.id.startsWith('deca'));
      const penta = els.find(e => e.id.startsWith('penta'));
      const grid = els.find(e => e.type === 'grid');

      // Viginti blocks are at bottom (stacking vertically)
      expect(viginti!.y).toBeGreaterThan(deca!.y);
      
      // Above the viginti stack, deca and its children align tops
      expect(deca!.y + deca!.height).toBe(penta!.y + penta!.height);
      expect(penta!.y + penta!.height).toBe(grid!.y + grid!.height);
    });

    it('should position Penta blocks and Grid within a virtual Deca-sized cell ($550)', () => {
      // 550 units = 1 Viginti (400) + 1 Deca (100) + 2 Penta (50) + Grid (0)
      fixture.componentRef.setInput('val', 550);
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const vigs = els.filter(e => e.type === 'viginti');
      const decas = els.filter(e => e.id.startsWith('deca'));
      const pentas = els.filter(e => e.id.startsWith('penta'));

      // 550 units with Viginti tier:
      // Row 1 (Bottom): Viginti 0
      // Row 2: Deca 0, [Virtual Cell]
      expect(vigs.length).toBe(1);
      expect(decas.length).toBe(1);
      
      // Deca and Penta align top edges (on the row above the Viginti foundation)
      const deca0Top = decas[0].y + decas[0].height;
      const penta0Top = pentas[0].y + pentas[0].height;
      expect(deca0Top).toBe(penta0Top); 
    });
    it('should form Viginti blocks one per row maximum ($800)', () => {
      // 800 units = 2 Viginti blocks (400 each)
      fixture.componentRef.setInput('val', 800);
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const vigs = els.filter(e => e.type === 'viginti');

      expect(vigs.length).toBe(2);
      expect(vigs[0].width).toBe(636);
      expect(vigs[0].height).toBe(636);
      
      // Vertical stacking check: y difference should be 640 (636 + 4 gap)
      const diffY = Math.abs(vigs[0].y - vigs[1].y);
      expect(diffY).toBe(640);
      
      // One per row check: they should have the same X (0)
      expect(vigs[0].x).toBe(0);
      expect(vigs[1].x).toBe(0);
    });
    it('should cap the hierarchy at Penta tier when requested ($400 with maxTier=penta)', () => {
      // $400 units = usually 1 Viginti, but with maxTier='penta' it should be 16 Pentas (400/25)
      fixture.componentRef.setInput('val', 400);
      fixture.componentRef.setInput('maxTier', 'penta');
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const decas = els.filter(e => e.type === 'deca');
      const vigs = els.filter(e => e.type === 'viginti');
      const pentas = els.filter(e => e.type === 'penta');

      expect(vigs.length).toBe(0);
      expect(decas.length).toBe(0);
      expect(pentas.length).toBe(16);
      expect(fixture.componentInstance.stackWidth()).toBe('narrow');
    });

    it('should stack Penta blocks vertically when they are the maxTier ($50 with maxTier=penta)', () => {
      // Normally 2 Pentas fit in a 316px cell (156 + 4 + 156 = 316)
      fixture.componentRef.setInput('val', 50);
      fixture.componentRef.setInput('maxTier', 'penta');
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const pentas = els.filter(e => e.type === 'penta');

      expect(pentas.length).toBe(2);
      
      // Vertical check: they should NOT be on the same row
      expect(pentas[0].y + pentas[0].height).not.toBe(pentas[1].y + pentas[1].height);
      
      // One per row check: X should be 0 for both
      expect(pentas[0].x).toBe(0);
      expect(pentas[1].x).toBe(0);
    });

    it('should ensure maxTier blocks have no siblings in their row ($28 with maxTier=penta)', () => {
      // 28 units = 1 Penta (25) + 3 Marbles (grid)
      // They should NOT be side-by-side even though they both fit in 316px (156 + 156 + 4 = 316)
      fixture.componentRef.setInput('val', 28);
      fixture.componentRef.setInput('maxTier', 'penta');
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const penta = els.find(e => e.type === 'penta');
      const grid = els.find(e => e.type === 'grid');

      expect(penta).toBeTruthy();
      expect(grid).toBeTruthy();
      
      // Vertical check: they should be on different rows
      expect(penta!.y + penta!.height).not.toBe(grid!.y + grid!.height);
      
      // Solitary check: X should be 0 for both
      expect(penta!.x).toBe(0);
      expect(grid!.x).toBe(0);
    });

    it('should scale Cash Flow width up to 1000 items without expanding horizontally ($1000 with maxTier=penta)', () => {
      // 1000 units = 40 Pentas (stacked vertically)
      fixture.componentRef.setInput('val', 1000);
      fixture.componentRef.setInput('maxTier', 'penta');
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const pentas = els.filter(e => e.type === 'penta');

      expect(pentas.length).toBe(40);
      expect(fixture.componentInstance.totalSvgWidth()).toBe(316);
      
      // All Pentas should be in a single column (X=0)
      pentas.forEach(p => expect(p.x).toBe(0));
    });

    it('should isolate Viginti blocks from leading balance in Asset view ($405 with maxTier=viginti)', () => {
      // 405 units = 1 Viginti (400) + 5 Marbles (grid)
      fixture.componentRef.setInput('val', 405);
      fixture.componentRef.setInput('maxTier', 'viginti');
      fixture.detectChanges();

      const els = fixture.componentInstance.allElements();
      const vig = els.find(e => e.type === 'viginti');
      const grid = els.find(e => e.type === 'grid');

      expect(vig).toBeTruthy();
      expect(grid).toBeTruthy();

      // No siblings in the row: Grid should be visually ABOVE Viginti foundation
      // In bottom-up flipped coords, "above" means a LOWER y + height.
      expect(grid!.y + grid!.height).toBeLessThan(vig!.y);
      expect(vig!.x).toBe(0);
      expect(grid!.x).toBe(0);
    });
  });
});
