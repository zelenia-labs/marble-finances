import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { FinanceStore } from '../../store/finance.store';
import { ModalComponent, ModalButton } from './modal.component';

@Component({
  selector: 'app-compare-select-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="store.isCompareModalOpen()"
      [title]="'Compare Months'"
      [buttons]="compareButtons()"
      (dismiss)="close()"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label
            for="baseMonthSelect"
            class="block text-[15px] font-bold text-gray-600 uppercase tracking-widest mb-2 ml-2"
            >Base Month</label
          >
          <select
            id="baseMonthSelect"
            (change)="setBaseId($event)"
            class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-[14px] font-bold text-slate focus:ring-2 focus:ring-inset focus:ring-slate/20 outline-none cursor-pointer"
          >
            @for (m of reversedMonths(); track m.id) {
              <option [value]="m.id" [selected]="m.id === baseId()">{{ m.date }}</option>
            }
          </select>
        </div>

        <div>
          <label
            for="targetMonthSelect"
            class="block text-[15px] font-bold text-gray-600 uppercase tracking-widest mb-2 ml-2"
            >Compare With</label
          >
          <select
            id="targetMonthSelect"
            (change)="setTargetId($event)"
            class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-[14px] font-bold text-slate focus:ring-2 focus:ring-inset focus:ring-slate/20 outline-none cursor-pointer"
          >
            @for (m of reversedMonths(); track m.id) {
              <option
                [value]="m.id"
                [selected]="m.id === targetId()"
                [disabled]="m.id === baseId()"
              >
                {{ m.date }}
              </option>
            }
          </select>
        </div>
      </div>
    </app-modal>
  `,
})
export class CompareSelectModalComponent {
  store = inject(FinanceStore);

  baseId = signal<string>('');
  targetId = signal<string>('');

  reversedMonths = computed(() => [...this.store.months()].reverse());

  compareButtons = computed<ModalButton[]>(() => [
    { label: 'Cancel', type: 'secondary', action: () => this.close() },
    { 
      label: 'Compare', 
      type: 'slate', 
      disabled: !this.baseId() || !this.targetId() || this.baseId() === this.targetId(),
      action: () => this.confirm() 
    }
  ]);

  constructor() {
    effect(() => {
      if (this.store.isCompareModalOpen()) {
        const months = this.store.months();
        if (months.length > 0) {
          const lastMonthId = months[months.length - 1].id;
          this.baseId.set(lastMonthId);

          // Auto-select the month immediately preceding the last month
          if (months.length > 1) {
            this.targetId.set(months[months.length - 2].id);
          } else {
            this.targetId.set('');
          }
        }
      }
    });
  }

  filteredTargets() {
    return this.store.months().filter((m) => m.id !== this.baseId());
  }

  setBaseId(e: Event) {
    const newBaseId = (e.target as HTMLSelectElement).value;
    this.baseId.set(newBaseId);

    // Auto-select the month immediately preceding the base month for MTM context
    const months = this.store.months();
    const baseIdx = months.findIndex((m) => m.id === newBaseId);

    if (baseIdx > 0) {
      this.targetId.set(months[baseIdx - 1].id);
    } else {
      this.targetId.set(''); // No preceding month available
    }
  }

  setTargetId(e: Event) {
    this.targetId.set((e.target as HTMLSelectElement).value);
  }

  close() {
    this.store.closeCompareModal();
  }

  confirm() {
    if (this.baseId() && this.targetId() && this.baseId() !== this.targetId()) {
      this.store.startComparison(this.baseId(), this.targetId());
    }
  }
}
