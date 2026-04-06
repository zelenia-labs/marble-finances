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

  it('should initialize with an empty changelog if no session data exists', () => {
    expect(store.changelog()).toEqual([]);
  });

  it('should record a change when a significant action occurs', () => {
    store.recordChange('Test Action', 'Details of the change');
    
    expect(store.changelog().length).toBe(1);
    expect(store.changelog()[0].label).toBe('Test Action');
    expect(store.changelog()[0].details).toBe('Details of the change');
  });

  it('should allow undoing the last change', () => {
    // Initial state
    store.recordChange('Initial');
    
    // Perform a change
    const initialMonths = JSON.stringify(store.months());
    store.recordChange('Change 1');
    
    expect(store.changelog().length).toBe(2);
    
    // Undo
    store.undo();
    
    expect(store.changelog().length).toBe(1);
    expect(store.changelog()[0].label).toBe('Initial');
    expect(JSON.stringify(store.months())).toBe(initialMonths);
  });

  it('should revert to a specific changelog entry', () => {
    store.recordChange('S0');
    const s0Months = JSON.stringify(store.months());
    
    store.recordChange('S1');
    store.recordChange('S2');
    
    const targetEntry = store.changelog()[0]; // Revert to S0
    store.promptRevert(targetEntry);
    store.confirmRevert();
    
    expect(store.changelog().length).toBe(1);
    expect(store.changelog()[0].label).toBe('S0');
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
