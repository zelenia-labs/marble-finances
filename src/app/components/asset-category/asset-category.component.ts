import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceStore, AssetCategory, formatHumanUSD } from '../../store/finance.store';
import { MarbleStackComponent } from '../marble-stack/marble-stack.component';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { App } from '../../app';

@Component({
  selector: 'app-asset-category',
  imports: [CommonModule, MarbleStackComponent, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './asset-category.component.html',
  host: {}
})
export class AssetCategoryComponent {
  asset = input.required<AssetCategory>();
  index = input.required<number>();
  monthIndex = input.required<number>();
  store = inject(FinanceStore);
  public mainApp = inject(App, { optional: true });

  grandTotal = computed(() => {
    return this.asset().assets.reduce((sum, sub) => sum + sub.val, 0);
  });

  formatUSD(val: number): string {
    return formatHumanUSD(val, this.store.marbleMultiplier());
  }

  // Sync the preview with the exact current canvas scale
  currentScaleTransform = computed(() => {
    const s = this.mainApp?.scale() ?? 1;
    return `scale(${s})`;
  });

  connectedLists = computed(() => {
    // Collect all sub-product list IDs across the whole asset board for this month
    return this.store.months()[this.monthIndex()].assetCategories.map((_, i) => `sublist-${this.monthIndex()}-${i}`);
  });

  onDrop(event: CdkDragDrop<number>) {
    this.store.moveSubAsset(
      this.monthIndex(),
      event.previousContainer.data, // fromAssetIndex
      event.item.data,             // fromSubIndex (accurate via cdkDragData)
      event.container.data,         // toAssetIndex
      event.currentIndex
    );
  }

  updateAmountFromInput(event: Event, subIndex: number, originalValue: number) {
    const el = event.target as HTMLElement;
    const rawText = el.innerText.trim().toUpperCase();
    
    // Extract base numeric part (remove everything except numbers and dots)
    let numericValue = parseFloat(rawText.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) return;

    // Apply humanized multipliers if detected
    if (rawText.includes('K')) numericValue *= 1000;
    else if (rawText.includes('M')) numericValue *= 1000000;

    // Convert back to marble units
    const newMarbleVal = numericValue / this.store.marbleMultiplier();
    
    if (newMarbleVal === originalValue) {
       // Refresh formatted text if pure value didn't change (resolves raw typing artifacts)
       el.innerText = this.formatUSD(originalValue);
       return;
    }

    const action = { 
        type: 'assetAmount' as const, monthIdx: this.monthIndex(), idx: this.index(), subIdx: subIndex, value: newMarbleVal,
        parentId: this.store.months()[this.monthIndex()].assetCategories[this.index()].id,
        targetId: this.store.months()[this.monthIndex()].assetCategories[this.index()].assets[subIndex].id 
    };
    
    // Strict Gate: If prior month and no auto-apply, stage first
    this.store.promptForwardUpdate(action);
  }

  private marbleTimeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

  updateMarbleAmount(subIndex: number, valText: string | number) {
    const action = { 
        type: 'assetAmount' as const, monthIdx: this.monthIndex(), idx: this.index(), subIdx: subIndex, value: valText,
        parentId: this.store.months()[this.monthIndex()].assetCategories[this.index()].id,
        targetId: this.store.months()[this.monthIndex()].assetCategories[this.index()].assets[subIndex].id 
    };

    // OPTIMISTIC UI: Apply locally immediately so the blocks change instantly
    this.store.applyLocalUpdate(action);

    // DEBOUNCE THE CASCADE PROMPT
    if (this.marbleTimeoutMap.has(action.targetId)) {
      clearTimeout(this.marbleTimeoutMap.get(action.targetId));
    }
    
    this.marbleTimeoutMap.set(action.targetId, setTimeout(() => {
      // This will trigger the modal if it's a prior month (without re-applying locally)
      this.store.promptForwardUpdate(action);
      this.marbleTimeoutMap.delete(action.targetId);
    }, 1000));
  }

  updateTitle(event: Event, subIndex: number | null, originalValue: string) {
    const el = event.target as HTMLElement;
    const newValue = el.innerText.trim();
    if (newValue === (originalValue || '').trim()) return;

    const actionType = subIndex !== null ? 'assetLabel' : 'categoryLabel';
    const month = this.store.months()[this.monthIndex()];
    
    let targetId: string;
    let parentId = '';

    if (subIndex !== null) {
        targetId = month.assetCategories[this.index()].assets[subIndex].id;
        parentId = month.assetCategories[this.index()].id;
    } else {
        targetId = month.assetCategories[this.index()].id;
    }

    const action = { 
        type: actionType as 'assetLabel' | 'categoryLabel', monthIdx: this.monthIndex(), idx: this.index(), subIdx: subIndex || undefined, value: newValue,
        targetId, parentId 
    };
    
    // Check if it's a prior month to determine if we should stage or apply immediately
    const isPriorMonth = action.monthIdx < this.store.months().length - 1;
    if (isPriorMonth && !this.store.autoApplyForward()) {
      // Hard gate for prior months: show modal first, preserve current UI value
      this.store.promptForwardUpdate(action);
    } else {
      // Current/future month or auto-apply: apply immediately
      this.store.promptForwardUpdate(action);
    }
  }

  updateNote(event: Event, subIndex: number, originalValue: string | null | undefined) {
    const el = event.target as HTMLInputElement;
    const newValue = el.value.trim();
    
    // THE NOTE LOCK: Prevent auto-sync/bubble closure until checked
    if (newValue === (originalValue || '').trim()) return;

    const action = {
        type: 'assetNote' as const, monthIdx: this.monthIndex(), idx: this.index(), subIdx: subIndex, value: newValue,
        parentId: this.store.months()[this.monthIndex()].assetCategories[this.index()].id,
        targetId: this.store.months()[this.monthIndex()].assetCategories[this.index()].assets[subIndex].id 
    };

    // Strict Protocol Check
    const isPriorMonth = action.monthIdx < this.store.months().length - 1;
    if (isPriorMonth && !this.store.autoApplyForward()) {
      this.store.promptForwardUpdate(action);
    } else {
      this.store.promptForwardUpdate(action);
    }
  }

  addNote(subIndex: number) {
    this.store.addNote(this.monthIndex(), this.index(), subIndex);
    this.store.setActiveMenuId(null);
    setTimeout(() => {
        document.getElementById(`note_${this.monthIndex()}_${this.index()}_${subIndex}`)?.focus();
    }, 10);
  }

  addSubcategory() {
    this.store.openAddBreakdownModal(this.monthIndex(), this.index());
    this.store.setActiveMenuId(null);
  }

  promptDeleteSub(subIndex: number) {
    this.store.promptDelete(this.monthIndex(), 'asset', this.index(), subIndex);
  }

  promptDeleteAsset() {
    this.store.promptDelete(this.monthIndex(), 'asset', this.index());
  }

  toggleMenu(evt: Event, menuId: string) {
    evt.stopPropagation();
    if (this.store.activeMenuId() === menuId) {
      this.store.setActiveMenuId(null);
    } else {
      this.store.setActiveMenuId(menuId);
    }
  }

  selectAll(evt: Event) {
    const el = evt.target as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  onDblClick(evt: MouseEvent) {
    evt.stopPropagation();
    const el = evt.target as HTMLElement;
    el.focus();
  }

  onEnterDown(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation(); // The "Enter" Lock
    (evt.target as HTMLElement).blur(); // Trigger the Change Check
  }

  triggerBlur(evt: Event) {
    (evt.target as HTMLElement).blur();
  }
}
