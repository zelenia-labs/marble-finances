import { Component, ChangeDetectionStrategy, inject, computed, input } from '@angular/core';

import { FinanceStore, CashFlowItem, formatHumanUSD } from '../../store/finance.store';
import { getColorProps } from '../../utils/color.util';
import { TooltipService } from '../../services/tooltip.service';
import { MarbleStackComponent } from '../marble-stack/marble-stack.component';

export interface GroupedCashFlowItem extends CashFlowItem {
  originalIndex: number;
}

@Component({
  selector: 'app-monthly-cash-flow',
  imports: [MarbleStackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './monthly-cash-flow.component.html',
  host: {},
})
export class MonthlyCashFlowComponent {
  monthIndex = input.required<number>();
  store = inject(FinanceStore);
  tooltip = inject(TooltipService);

  monthRecord = computed(() => this.store.months()[this.monthIndex()]);

  expenseGroups = computed(() => {
    const groupMap = new Map<
      string,
      { label: string; total: number; items: GroupedCashFlowItem[] }
    >();
    this.monthRecord().flow.forEach((item, originalIndex) => {
      if (item.parentCategory !== 'expense') return;

      // IA RULE: Map Housing/Food/Groceries to 'fixed', renamed 'flex' to 'flexible'
      let type = (item.type || 'fixed').toLowerCase();
      if (type === 'housing' || type === 'food' || type === 'groceries') type = 'fixed';
      if (type === 'flex') type = 'flexible';

      if (!groupMap.has(type)) {
        groupMap.set(type, { label: type, total: 0, items: [] });
      }
      const g = groupMap.get(type)!;
      g.total += item.val;
      g.items.push({ ...item, originalIndex });
    });

    return Array.from(groupMap.values()).sort((a, b) => {
      // IA RULE: FIXED first, then FLEXIBLE
      if (a.label === 'fixed') return -1;
      if (b.label === 'fixed') return 1;
      if (a.label === 'flexible') return -1;
      if (b.label === 'flexible') return 1;
      return a.label.localeCompare(b.label);
    });
  });

  savingsGroups = computed(() => {
    const groupMap = new Map<
      string,
      { label: string; total: number; items: GroupedCashFlowItem[] }
    >();
    this.monthRecord().flow.forEach((item, originalIndex) => {
      if (item.parentCategory !== 'savings') return;
      const type = item.type || 'general';
      if (!groupMap.has(type)) {
        groupMap.set(type, { label: type, total: 0, items: [] });
      }
      const g = groupMap.get(type)!;
      g.total += item.val;
      g.items.push({ ...item, originalIndex });
    });

    return Array.from(groupMap.values()).sort((a, b) => {
      if (a.label === 'general') return -1;
      if (b.label === 'general') return 1;
      return a.label.localeCompare(b.label);
    });
  });

  combinedFlowTotal = computed(() =>
    this.monthRecord()
      .flow.filter((i) => i.parentCategory === 'expense')
      .reduce((t, i) => t + i.val, 0),
  );

  savingsTotal = computed(() =>
    this.monthRecord()
      .flow.filter((i) => i.parentCategory === 'savings')
      .reduce((t, i) => t + i.val, 0),
  );

  expenseSavingsRatio = computed(() => {
    const exp = this.combinedFlowTotal();
    const sav = this.savingsTotal();
    const total = exp + sav;
    return total > 0
      ? {
          expensesPct: (exp / total) * 100,
          savingsPct: (sav / total) * 100,
        }
      : { expensesPct: 0, savingsPct: 0 };
  });

  getFullBlocks(val: number): number[] {
    return Array(Math.floor(val)).fill(0);
  }

  getColorPropsClass(color: string): string {
    return getColorProps(color, 'full').cls;
  }

  getColorPropsStyle(color: string): string {
    return getColorProps(color, 'full').stl;
  }

  private flowTimeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

  updateAmount(index: number, val: number) {
    const action = {
      type: 'flowAmount' as const,
      monthIdx: this.monthIndex(),
      idx: index,
      value: val,
      targetId: this.store.months()[this.monthIndex()].flow[index].id,
    };

    // OPTIMISTIC UI: Instant update for the blocks
    this.store.applyLocalUpdate(action);

    if (this.flowTimeoutMap.has(action.targetId)) {
      clearTimeout(this.flowTimeoutMap.get(action.targetId));
    }

    this.flowTimeoutMap.set(
      action.targetId,
      setTimeout(() => {
        // Debounce the cascading prompt
        this.store.promptForwardUpdate(action);
        this.flowTimeoutMap.delete(action.targetId);
      }, 1000),
    );
  }

  updateLabel(index: number, label: string) {
    const action = {
      type: 'flowLabel' as const,
      monthIdx: this.monthIndex(),
      idx: index,
      value: label,
      targetId: this.store.months()[this.monthIndex()].flow[index].id,
    };
    this.store.promptForwardUpdate(action);
  }

  updateOverview(
    event: Event,
    field: 'grossAnnual' | 'netAnnual' | 'netMonthly' | 'date',
    originalValue: string,
  ) {
    const el = event.target as HTMLElement;
    const newValue = el.innerText.trim();
    if (newValue === (originalValue || '').trim()) return;

    const action = {
      type: 'overview' as const,
      monthIdx: this.monthIndex(),
      field,
      value: newValue,
      idx: 0,
    };

    const isPriorMonth = action.monthIdx < this.store.months().length - 1;
    if (isPriorMonth && !this.store.autoApplyForward()) {
      this.store.promptForwardUpdate(action);
    } else {
      this.store.promptForwardUpdate(action);
    }
  }

  blurElement(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement)?.blur();
  }

  updateAmountFromInput(index: number, event: Event, originalValue: number) {
    const el = event.target as HTMLElement;
    const rawText = el.innerText.trim().toUpperCase();

    let numericValue = parseFloat(rawText.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) return;

    if (rawText.includes('K')) numericValue *= 1000;
    else if (rawText.includes('M')) numericValue *= 1000000;

    const newMarbleVal = numericValue / this.store.marbleMultiplier();

    if (newMarbleVal === originalValue) {
      el.innerText = this.formatUSD(originalValue);
      return;
    }

    const action = {
      type: 'flowAmount' as const,
      monthIdx: this.monthIndex(),
      idx: index,
      value: newMarbleVal,
      targetId: this.store.months()[this.monthIndex()].flow[index].id,
    };
    this.store.promptForwardUpdate(action);
  }

  selectAll(evt: Event) {
    const el = evt.target as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  updateFlowLabel(index: number, event: Event, originalValue: string) {
    const el = event.target as HTMLElement;
    const newValue = el.innerText.trim();
    if (newValue === originalValue.trim()) return;

    const action = {
      type: 'flowLabel' as const,
      monthIdx: this.monthIndex(),
      idx: index,
      value: newValue,
      targetId: this.store.months()[this.monthIndex()].flow[index].id,
    };

    const isPriorMonth = action.monthIdx < this.store.months().length - 1;
    if (isPriorMonth && !this.store.autoApplyForward()) {
      this.store.promptForwardUpdate(action);
    } else {
      this.store.promptForwardUpdate(action);
    }
  }

  promptDeleteFlow(index: number) {
    this.store.promptDelete(this.monthIndex(), 'flow', index);
  }

  toggleMenu(evt: Event, menuId: string) {
    evt.stopPropagation();
    if (this.store.activeMenuId() === menuId) {
      this.store.setActiveMenuId(null);
    } else {
      this.store.setActiveMenuId(menuId);
    }
  }

  formatUSD(val: number): string {
    return formatHumanUSD(val, this.store.marbleMultiplier());
  }

  // Removed getFlowBlocks as we now use app-marble-stack
}
