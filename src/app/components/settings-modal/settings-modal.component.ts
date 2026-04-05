import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinanceStore, formatHumanUSD } from '../../store/finance.store';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
      
      <div class="relative bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <!-- Close Button -->
        <button (click)="close()" class="btn-dismiss absolute top-8 right-8 interactive-element" aria-label="Close Settings">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>
        </button>

        <h2 class="text-2xl font-black text-slate mb-2 tracking-tight">App Settings</h2>
        <p class="text-sm text-gray-500 mb-8 font-medium">Configure global mechanics for Financial Marbles</p>

        <!-- Setting: Marble Multiplier -->
        <div class="space-y-4">
            <div>
                <label for="multiplierInput" class="block text-sm font-bold text-slate mb-1">Marble Block Multiplier</label>
                <p class="text-xs text-gray-500 font-medium mb-3">Define how much actual dollar value a single full marble block represents in the visualization.</p>
                
                <div class="relative flex items-center mb-6">
                    <span class="absolute left-4 text-gray-400 font-bold">$</span>
                    <input id="multiplierInput" type="number" 
                        [value]="store.marbleMultiplier()" 
                        (input)="onMultiplierInput($event)"
                        class="w-full h-14 pl-8 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold text-slate focus:outline-none focus:ring-2 focus:ring-assetBlue/50 focus:border-assetBlue transition-all text-right">
                </div>
                
                <!-- UX Visualization Helper -->
                <div class="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center gap-4">
                    <div class="w-16 h-16 rounded-[14px] bg-assetBlue shrink-0 shadow-sm border border-black/5"></div>
                    <div class="flex flex-col">
                        <span class="text-xl font-black text-slate">= {{ formatHumanUSD(1, store.marbleMultiplier()) }}</span>
                        <span class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Value of 1 block</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action / Save -->
        <div class="mt-8 pt-6 border-t border-gray-100 w-full">
            <button (click)="close()" class="w-full h-14 bg-slate-900 border-2 border-slate-900 text-white hover:bg-slate-800 rounded-2xl font-bold tracking-wide transition-all shadow-md active:scale-[0.98]">
              Done
            </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsModalComponent {
  store = inject(FinanceStore);

  close() {
    this.store.setSettingsOpen(false);
  }

  onMultiplierInput(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value) || 1;
    this.store.setMarbleMultiplier(Math.max(1, val));
  }

  formatHumanUSD(blocks: number, multiplier: number): string {
    return formatHumanUSD(blocks, multiplier);
  }
}
