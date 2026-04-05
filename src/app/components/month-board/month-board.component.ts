import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceStore } from '../../store/finance.store';
import { AssetCategoryComponent } from '../asset-category/asset-category.component';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MonthlyCashFlowComponent } from '../monthly-cash-flow/monthly-cash-flow.component';
import { SummaryPanelComponent } from '../summary-panel/summary-panel.component';
import { ActionItemsComponent } from '../action-items/action-items.component';

import { SparklineComponent } from '../sparkline/sparkline.component';

@Component({
  selector: 'app-month-board',
  imports: [CommonModule, AssetCategoryComponent, MonthlyCashFlowComponent, SummaryPanelComponent, ActionItemsComponent, SparklineComponent, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './month-board.component.html',
  host: {
    'class': 'flex flex-col min-w-max h-full',
    'style': 'transform: translateZ(0); backface-visibility: hidden;'
  }
})
export class MonthBoardComponent {
  monthIndex = input.required<number>();
  store = inject(FinanceStore);
  
  monthRecord = computed(() => this.store.months()[this.monthIndex()]);
  assetCategories = computed(() => this.monthRecord().assetCategories);

  stats = computed(() => this.store.monthStats().get(this.monthRecord().id) || { mtm: 0, ytd: 0, currentTotal: 0, cashPercent: 0, investmentsPercent: 0, liquidNetWorth: 0 });

  updateOverview(event: Event, field: 'grossAnnual' | 'netAnnual' | 'netMonthly' | 'date', originalValue: string) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === (originalValue || '').trim() || !el.innerText.trim()) return;

    const action = { type: 'overview' as const, monthIdx: this.monthIndex(), field, value: el.innerText || '', idx: 0 };
    this.store.promptForwardUpdate(action);
  }

  onColumnDrop(event: CdkDragDrop<unknown>) {
    this.store.reorderAssets(this.monthIndex(), event.previousIndex, event.currentIndex);
  }

  blurElement(event: Event) {
    (event.target as HTMLElement)?.blur();
  }
}
