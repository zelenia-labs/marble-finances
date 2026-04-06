import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinanceStore } from '../../store/finance.store';

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

        <h2 class="text-2xl font-black text-slate mb-2 tracking-tight">Financial Scale</h2>
        <p class="text-sm text-gray-500 mb-8 font-medium italic">How each weight of marble translates to currency</p>

        <div class="space-y-6">
            <!-- Setting: Marble Value Input -->
            <div class="p-6 bg-slate-50 border border-slate-100 rounded-[28px]">
                <label for="marbleValueInput" class="block text-[11px] font-black uppercase text-slate/40 tracking-widest mb-4">Unit Value ($)</label>
                <div class="relative flex items-center mb-0">
                    <span class="absolute left-4 text-gray-400 font-black">$</span>
                    <input id="marbleValueInput" type="number" 
                        [value]="getMarbleValue()" 
                        (input)="onMarbleInput($event)"
                        class="w-full h-14 pl-10 pr-4 bg-white border border-gray-100 rounded-2xl text-xl font-black text-slate focus:outline-none focus:ring-4 focus:ring-assetBlue/10 transition-all text-right shadow-sm tracking-tight">
                </div>
            </div>

            <!-- Legend Grid -->
            <div class="space-y-3 px-2">
                <h3 class="text-[10px] font-black uppercase text-slate/30 tracking-[.2em] px-4 mb-4">Legend</h3>
                
                <!-- 1 Marble -->
                <div class="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-50 shadow-sm transition-all hover:border-gray-200">
                    <div class="flex items-center gap-4">
                        <div class="w-6 h-6 rounded-[2px] bg-assetBlue shadow-sm"></div>
                        <span class="text-xs font-bold text-slate/80">1 Marble</span>
                    </div>
                    <span class="text-sm font-black text-slate">{{ formatUSD(getMarbleValue()) }}</span>
                </div>

                <!-- 5x5 Block -->
                <div class="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-50 shadow-sm transition-all hover:border-gray-200">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-[4px] bg-assetBlue shadow-sm relative overflow-hidden flex items-center justify-center p-0.5">
                             <div class="grid grid-cols-2 grid-rows-2 gap-[1px] w-full h-full opacity-30">
                                <div class="bg-white rounded-[1px]"></div><div class="bg-white rounded-[1px]"></div>
                                <div class="bg-white rounded-[1px]"></div><div class="bg-white rounded-[1px]"></div>
                             </div>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate/80 leading-none">5x5 Block</span>
                            <span class="text-[9px] font-black text-slate/30 uppercase tracking-widest mt-1">25 Marbles</span>
                        </div>
                    </div>
                    <span class="text-sm font-black text-assetBlue">{{ formatUSD(getMarbleValue() * 25) }}</span>
                </div>

                <!-- 10x10 Huge Block -->
                <div class="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-50 shadow-sm transition-all hover:border-gray-200">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-[6px] bg-assetBlue shadow-sm relative overflow-hidden flex items-center justify-center p-1">
                             <div class="grid grid-cols-2 grid-rows-2 gap-[2px] w-full h-full opacity-40">
                                <div class="bg-white rounded-[1px]"></div><div class="bg-white rounded-[1px]"></div>
                                <div class="bg-white rounded-[1px]"></div><div class="bg-white rounded-[1px]"></div>
                             </div>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate/80 leading-none">10x10 Block</span>
                            <span class="text-[9px] font-black text-slate/30 uppercase tracking-widest mt-1">100 Marbles</span>
                        </div>
                    </div>
                    <span class="text-base font-black text-slate">{{ formatUSD(getMarbleValue() * 100) }}</span>
                </div>
            </div>
        </div>

        <!-- Action / Save -->
        <div class="mt-8 pt-4 w-full border-t border-gray-50">
            <button (click)="close()" class="w-full h-14 bg-slate-900 border-2 border-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black tracking-widest uppercase text-[11px] transition-all shadow-xl active:scale-[0.98]">
              Confirm Update
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

  getMarbleValue(): number {
    return this.store.marbleMultiplier() / 25;
  }

  onMarbleInput(event: Event) {
    const marbleVal = parseInt((event.target as HTMLInputElement).value) || 1;
    this.store.setMarbleMultiplier(Math.max(1, marbleVal * 25));
  }

  formatUSD(val: number): string {
    if (val >= 1000000) return `$${(val / 1000000).toLocaleString()}M`;
    if (val >= 1000) return `$${(val / 1000).toLocaleString()}K`;
    return `$${val.toLocaleString()}`;
  }
}
