import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { TooltipService } from './services/tooltip.service';
import { FinanceStore } from './store/finance.store';

describe('App Component — Zoom Functionality', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let mockStore: unknown;
  let mockTooltip: unknown;

  beforeEach(async () => {
    vi.useFakeTimers();

    mockStore = {
      months: signal([]),
      monthsByYear: signal([]),
      compareState: signal(null),
      isTimelineOpen: signal(false),
      activeMenuId: signal(null),
      isAddModalOpen: signal(false),
      isDeleteModalOpen: signal(false),
      isCompareModalOpen: signal(false),
      forwardTarget: signal(null),
      isSettingsOpen: signal(false),
      isChartsModalOpen: signal(false),
      isCompareRibbonVisible: signal(false),
      activeTimelineIndex: signal(0),
      setActiveTimelineIndex: vi.fn(),
      toggleTimeline: vi.fn(),
    };

    mockTooltip = {
      setPopoverRef: vi.fn(),
      getTooltipLabel: () => signal(''),
      show: vi.fn(),
      hide: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        { provide: FinanceStore, useValue: mockStore },
        { provide: TooltipService, useValue: mockTooltip },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should have zoom controls hidden by default', () => {
    const zoomControls = fixture.debugElement.query(By.css('.fixed.bottom-8.right-8'));
    expect(zoomControls).toBeNull();
    expect(component.isZoomControlsVisible()).toBe(false);
  });

  it('should show zoom controls on mouse move', () => {
    // Trigger window mousemove since it's attached to window in constructor
    window.dispatchEvent(new MouseEvent('mousemove'));
    fixture.detectChanges();

    expect(component.isZoomControlsVisible()).toBe(true);
    const zoomControls = fixture.debugElement.query(By.css('.fixed.bottom-8.right-8'));
    expect(zoomControls).not.toBeNull();
  });

  it('should hide zoom controls after 3 seconds of inactivity', () => {
    window.dispatchEvent(new MouseEvent('mousemove'));
    fixture.detectChanges();
    expect(component.isZoomControlsVisible()).toBe(true);

    // Fast Forward 3 seconds
    vi.advanceTimersByTime(3000);
    fixture.detectChanges();

    expect(component.isZoomControlsVisible()).toBe(false);
  });

  it('should reset hide timer when zooming in', () => {
    window.dispatchEvent(new MouseEvent('mousemove'));
    fixture.detectChanges();

    vi.advanceTimersByTime(2000); // 2 seconds pass
    fixture.detectChanges();
    expect(component.isZoomControlsVisible()).toBe(true);

    component.zoomIn(); // Use functionality
    fixture.detectChanges();

    vi.advanceTimersByTime(2000); // Another 2 seconds pass (total 4s since mouse move, but only 2s since zoomIn)
    fixture.detectChanges();
    expect(component.isZoomControlsVisible()).toBe(true);

    vi.advanceTimersByTime(1001); // 1 more second (3s since zoomIn)
    fixture.detectChanges();
    expect(component.isZoomControlsVisible()).toBe(false);
  });

  it('should increase scale on zoomIn', () => {
    const initialScale = component.scale();
    component.zoomIn();
    expect(component.scale()).toBeGreaterThan(initialScale);
  });

  it('should decrease scale on zoomOut', () => {
    const initialScale = component.scale();
    component.zoomOut();
    expect(component.scale()).toBeLessThan(initialScale);
  });

  it('should respect scale limits (min 0.05, max 4)', () => {
    // Zoom out many times
    for (let i = 0; i < 20; i++) {
      component.zoomOut();
    }
    expect(component.scale()).toBe(0.05);

    // Zoom in many times
    for (let i = 0; i < 50; i++) {
      component.zoomIn();
    }
    expect(component.scale()).toBe(4);
  });
});
