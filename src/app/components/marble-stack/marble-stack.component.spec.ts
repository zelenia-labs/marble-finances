import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarbleStackComponent } from './marble-stack.component';
import { FinanceStore } from '../../store/finance.store';
import { TooltipService } from '../../services/tooltip.service';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

import { vi } from 'vitest';

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
    
    // The large marble blocks are in the first @for loop
    const allLargeBlocks = fixture.debugElement.queryAll(By.css('.rounded-\\[4px\\]')); 
    expect(allLargeBlocks.length).toBe(1);
    
    // REGRESSION PROTECTION: Verify styles are merged and NOT overwritten
    const element = allLargeBlocks[0].nativeElement;
    expect(element.style.width).toBe('156px'); // (5 * 32) - 4
    expect(element.style.height).toBe('156px');
    expect(element.style.backgroundColor).toContain('var(--color-marble-asset-blue)');
  });

  it('should render 2 Large Marble Blocks when value reaches 50', () => {
    fixture.componentRef.setInput('val', 50);
    fixture.componentRef.setInput('size', 5);
    fixture.detectChanges();

    const allLargeBlocks = fixture.debugElement.queryAll(By.css('.rounded-\\[4px\\]')); 
    expect(allLargeBlocks.length).toBe(2);
  });

  it('should render a Huge Marble Block when value reaches 100', () => {
    fixture.componentRef.setInput('val', 100);
    fixture.detectChanges();

    // Huge marble blocks are w-[316px] h-[316px]
    const hugeBlock = fixture.debugElement.query(By.css('[class*="w-[316px]"]'));
    expect(hugeBlock).toBeTruthy();
    expect(hugeBlock.nativeElement.style.backgroundColor).toContain('var(--color-marble-asset-blue)');
  });

  it('should handle non-asset colors (flow blocks)', () => {
    fixture.componentRef.setInput('val', 25);
    fixture.componentRef.setInput('color', 'bg-flow-orange');
    fixture.detectChanges();

    const largeBlock = fixture.debugElement.query(By.css('.rounded-\\[4px\\]'));
    expect(largeBlock.nativeElement.style.backgroundColor).toContain('var(--color-flow-orange)');
  });
});
