import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { FinanceStore } from '../../store/finance.store';

@Component({
  selector: 'app-action-items',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './action-items.component.html',
})
export class ActionItemsComponent {
  monthIndex = input.required<number>();
  store = inject(FinanceStore);
  todoLabels = viewChildren<ElementRef<HTMLElement>>('todoLabel');

  menuItemId = signal<string | null>(null);
  menuOffsetX = signal(0);

  sortedActionItems = computed(() => {
    const items = this.store.months()[this.monthIndex()].actionItems || [];
    const incomplete = items.filter((i) => !i.completed);
    const completed = items.filter((i) => i.completed);
    return { incomplete, completed };
  });

  openMenu(event: MouseEvent, id: string) {
    event.stopPropagation();
    if (this.menuItemId() === id) {
      this.menuItemId.set(null);
      return;
    }
    // offsetX gives position within the clicked element — use that to align menu horizontally
    this.menuOffsetX.set(Math.max(0, event.offsetX - 20));
    this.menuItemId.set(id);
  }

  deleteItem() {
    const id = this.menuItemId();
    if (id) {
      this.store.deleteActionItem(this.monthIndex(), id);
      this.menuItemId.set(null);
    }
  }

  addAction() {
    this.store.addActionItem(this.monthIndex());
    setTimeout(() => {
      const labels = this.todoLabels();
      if (labels.length > 0) {
        labels[labels.length - 1].nativeElement.focus();
      }
    }, 50);
  }

  updateLabel(id: string, event: FocusEvent) {
    const label = (event.target as HTMLElement).innerText.trim();
    this.store.updateActionItem(this.monthIndex(), id, label);
  }

  blurElement(event: Event) {
    (event.target as HTMLElement).blur();
  }
}
