import { TestBed } from '@angular/core/testing';
import { FinanceStore } from './finance.store';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FinanceStore: Changelog & Undo Functionality', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceStore]
    });
    store = TestBed.inject(FinanceStore);
  });

  it('should initialize with an initial snapshot if no session data exists', () => {
    expect(store.changelog().length).toBe(1);
    expect(store.changelog()[0].label).toBe('Initial Portfolio Snapshot');
  });

  it('should record a change when a significant action occurs', () => {
    store.recordChange('Test Action', 'Details of the change');
    
    expect(store.changelog().length).toBe(2);
    expect(store.changelog()[1].label).toBe('Test Action');
    expect(store.changelog()[1].details).toBe('Details of the change');
  });

  it('should allow undoing the last change', () => {
    // Initial snapshot is already present, add one more
    store.recordChange('Initial');
    
    // Perform a change
    const initialMonths = JSON.stringify(store.months());
    store.recordChange('Change 1');
    
    expect(store.changelog().length).toBe(3);
    
    // Undo
    store.undo();
    
    expect(store.changelog().length).toBe(2);
    expect(store.changelog()[1].label).toBe('Initial');
    expect(JSON.stringify(store.months())).toBe(initialMonths);
  });

  it('should revert to a specific changelog entry', () => {
    // Snapshot is at [0]
    store.recordChange('S0'); // [1]
    const s0Months = JSON.stringify(store.months());
    
    store.recordChange('S1'); // [2]
    store.recordChange('S2'); // [3]
    
    const targetEntry = store.changelog()[1]; // Revert to S0
    store.promptRevert(targetEntry);
    store.confirmRevert();
    
    expect(store.changelog().length).toBe(2);
    expect(store.changelog()[1].label).toBe('S0');
    expect(JSON.stringify(store.months())).toBe(s0Months);
  });

  it('should limit changelog to the last 50 entries', () => {
    for (let i = 0; i < 60; i++) {
        store.recordChange(`Action ${i}`);
    }
    
    expect(store.changelog().length).toBe(50);
    expect(store.changelog()[49].label).toBe('Action 59');
  });
});
