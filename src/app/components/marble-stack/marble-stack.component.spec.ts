import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipService } from '../../services/tooltip.service';
import { FinanceStore } from '../../store/finance.store';
import { MarbleStackComponent } from './marble-stack.component';

import { beforeEach, describe, expect, it, vi } from 'vitest';

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

  it('should render 1 Large Marble Block when value reaches 25 (with grid size 5)', () => {
    // 25 marbles = 1 full 5x5 block
    fixture.componentRef.setInput('val', 25);
    fixture.componentRef.setInput('size', 5);
    fixture.detectChanges();

    // The large marble blocks have data-type="large"
    const allLargeBlocks = fixture.debugElement.queryAll(By.css('[data-type="large"]'));
    expect(allLargeBlocks.length).toBe(1);

    const rect = allLargeBlocks[0].nativeElement.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect!.getAttribute('width')).toBe('156'); // (5 * 32) - 4
    expect(rect!.getAttribute('height')).toBe('156');
    expect(rect!.getAttribute('fill')).toContain('var(--color-marble-asset-blue)');
  });

  it('should render 2 Large Marble Blocks when value reaches 50', () => {
    fixture.componentRef.setInput('val', 50);
    fixture.componentRef.setInput('size', 5);
    fixture.detectChanges();

    const allLargeBlocks = fixture.debugElement.queryAll(By.css('[data-type="large"]'));
    expect(allLargeBlocks.length).toBe(2);
  });

  it('should render a Huge Marble Block when value reaches 100', () => {
    fixture.componentRef.setInput('val', 100);
    fixture.detectChanges();

    const hugeBlock = fixture.debugElement.query(By.css('[data-type="huge"]'));
    expect(hugeBlock).toBeTruthy();

    const rect = hugeBlock.nativeElement.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect!.getAttribute('width')).toBe('316');
    expect(rect!.getAttribute('fill')).toContain('var(--color-marble-asset-blue)');
  });

  it('should handle non-asset colors (flow blocks)', () => {
    fixture.componentRef.setInput('val', 25);
    fixture.componentRef.setInput('color', 'bg-flow-orange');
    fixture.detectChanges();

    const largeBlock = fixture.debugElement.query(By.css('[data-type="large"]'));
    const rect = largeBlock.nativeElement.querySelector('rect');
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
});
