import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceStore } from '../../store/finance.store';

@Component({
  selector: 'app-compare-select-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-200 flex items-center justify-center p-4 transition-all duration-300"
         [class.opacity-0]="!store.isCompareModalOpen()"
         [class.opacity-100]="store.isCompareModalOpen()">
      <div class="absolute inset-0 bg-slate/40 backdrop-blur-sm"></div>
      <div class="bg-white rounded-[32px] shadow-2xl p-8 w-[400px] border border-gray-100 flex flex-col relative transition-all duration-300"
           [class.scale-95]="!store.isCompareModalOpen()"
           [class.scale-100]="store.isCompareModalOpen()"
           [class.translate-y-4]="!store.isCompareModalOpen()"
           [class.translate-y-0]="store.isCompareModalOpen()">
         <button (click)="close()" class="btn-dismiss absolute top-8 right-8 interactive-element" aria-label="Close Comparison modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
               <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
         </button>

         <h2 class="text-2xl font-black text-slate mb-6">Compare Months</h2>

         <div class="flex flex-col gap-4">
            <div>
              <label for="baseMonthSelect" class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Base Month</label>
              <select id="baseMonthSelect" (change)="setBaseId($event)" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate focus:ring-2 focus:ring-inset focus:ring-slate/20 outline-none cursor-pointer">
                 @for (m of reversedMonths(); track m.id) {
                    <option [value]="m.id" [selected]="m.id === baseId()">{{ m.date }}</option>
                 }
              </select>
            </div>

            <div>
              <label for="targetMonthSelect" class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Compare With</label>
              <select id="targetMonthSelect" (change)="setTargetId($event)" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate focus:ring-2 focus:ring-inset focus:ring-slate/20 outline-none cursor-pointer">
                 @for (m of reversedMonths(); track m.id) {
                    <option [value]="m.id" [selected]="m.id === targetId()" [disabled]="m.id === baseId()">{{ m.date }}</option>
                 }
              </select>
            </div>
         </div>

         <div class="flex mt-8 gap-3">
            <button (click)="close()" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button (click)="confirm()" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate hover:bg-slate/90 transition-colors" [disabled]="!baseId() || !targetId() || baseId() === targetId()" [class.opacity-50]="!baseId() || !targetId() || baseId() === targetId()">Compare</button>
         </div>
      </div>
    </div>
  `
})
export class CompareSelectModalComponent {
  store = inject(FinanceStore);

  baseId = signal<string>('');
  targetId = signal<string>('');

  reversedMonths = computed(() => [...this.store.months()].reverse());

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
    return this.store.months().filter(m => m.id !== this.baseId());
  }

  setBaseId(e: Event) {
    const newBaseId = (e.target as HTMLSelectElement).value;
    this.baseId.set(newBaseId);
    
    // Auto-select the month immediately preceding the base month for MTM context
    const months = this.store.months();
    const baseIdx = months.findIndex(m => m.id === newBaseId);
    
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
