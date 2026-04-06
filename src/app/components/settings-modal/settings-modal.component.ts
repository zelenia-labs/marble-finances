import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FinanceStore } from '../../store/finance.store';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
      
      <div class="relative bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
           role="dialog" aria-modal="true">
        <!-- Close Button -->
        <button (click)="close()" class="btn-dismiss absolute top-8 right-8 interactive-element" aria-label="Close Settings">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>
        </button>

        <h2 class="text-2xl font-black text-slate mb-3 tracking-normal">Financial Scale</h2>
        <p class="text-[16px] text-gray-500 mb-10 font-medium tracking-normal leading-relaxed">How each weight of marble translates to currency</p>
 
        <div class="space-y-6">
            <!-- Setting: Marble Value Input (Underlined Style) -->
            <div class="mb-8">
                <label for="marbleValueInput" class="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Marble Value</label>
                <div class="relative flex items-center mb-0">
                    <span class="absolute left-0 text-slate font-black text-2xl pb-2">$</span>
                    <input #marbleInput id="marbleValueInput" type="number" 
                        [value]="getMarbleValue()" 
                        (input)="onMarbleInput($event)"
                        class="w-full border-b-2 border-slate/10 focus:border-slate outline-none text-2xl font-bold text-slate pl-6 pb-2 transition-colors interactive-element">
                </div>
            </div>
 
            <!-- Legend Grid -->
            <div class="space-y-0">
                <h3 class="text-[12px] font-bold uppercase text-gray-500 tracking-wider mt-4 mb-0">Legend</h3>
                
                <div class="divide-y-2 divide-gray-100">
                    <!-- 1 Marble -->
                    <div class="flex items-center justify-between py-6 transition-colors">
                        <div class="flex items-center gap-6">
                            <div class="w-6 h-6 rounded-[4px] bg-asset-blue shadow-sm"></div>
                            <span class="text-[16px] font-bold text-slate">1 Marble</span>
                        </div>
                        <span class="text-[16px] font-black text-slate">{{ formatUSD(getMarbleValue()) }}</span>
                    </div>
    
                    <!-- 5x5 Block -->
                    <div class="flex items-center justify-between py-6 transition-colors">
                        <div class="flex items-center gap-6">
                            <div class="w-10 h-10 rounded-[6px] bg-asset-blue shadow-sm relative overflow-hidden flex items-center justify-center p-0.5">
                                 <div class="grid grid-cols-2 grid-rows-2 gap-[1px] w-full h-full opacity-30">
                                    <div class="bg-white rounded-[1px]"></div><div class="bg-white rounded-[1px]"></div>
                                    <div class="bg-white rounded-[1px]"></div><div class="bg-white rounded-[1px]"></div>
                                 </div>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-[16px] font-bold text-slate">5x5 Block</span>
                                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">25 Marbles</span>
                            </div>
                        </div>
                        <span class="text-[16px] font-black text-slate">{{ formatUSD(getMarbleValue() * 25) }}</span>
                    </div>
    
                    <!-- 10x10 Huge Block -->
                    <div class="flex items-center justify-between py-6 transition-colors">
                        <div class="flex items-center gap-6">
                            <div class="w-14 h-14 rounded-[8px] bg-asset-blue shadow-sm relative overflow-hidden flex items-center justify-center p-1">
                                 <div class="grid grid-cols-2 grid-rows-2 gap-[2px] w-full h-full opacity-40">
                                    <div class="bg-white rounded-[1px]"></div><div class="bg-white rounded-[1px]"></div>
                                    <div class="bg-white rounded-[1px]"></div><div class="bg-white rounded-[1px]"></div>
                                 </div>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-[16px] font-bold text-slate">10x10 Block</span>
                                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">100 Marbles</span>
                            </div>
                        </div>
                        <span class="text-[18px] font-black text-slate">{{ formatUSD(getMarbleValue() * 100) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action / Save -->
        <div class="mt-8 pt-4 w-full flex flex-col gap-3 border-t border-gray-50">
            <button (click)="close()" class="w-full h-14 bg-slate-900 border-2 border-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black tracking-widest uppercase text-[11px] transition-all shadow-lg active:scale-[0.98]">
              Confirm Update
            </button>
            <button (click)="resetDemo()" class="w-full h-12 border-2 border-red-50 text-red-500 hover:bg-red-50 rounded-2xl font-black tracking-widest uppercase text-[10px] transition-all active:scale-[0.98]">
              Reset to Demo Data
            </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsModalComponent implements AfterViewInit {
  store = inject(FinanceStore);
  
  @ViewChild('marbleInput') marbleInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    // Small timeout to ensure the modal animation hasn't blocked the focus
    setTimeout(() => {
        this.marbleInput.nativeElement.focus();
        this.marbleInput.nativeElement.select();
    }, 150);
  }

  close() {
    this.store.setSettingsOpen(false);
  }

  resetDemo() {
    this.store.resetToDemoData();
    this.close();
  }

  getMarbleValue(): number {
    return this.store.marbleMultiplier();
  }

  onMarbleInput(event: Event) {
    const marbleVal = parseInt((event.target as HTMLInputElement).value) || 1;
    this.store.setMarbleMultiplier(Math.max(1, marbleVal));
  }

  formatUSD(val: number): string {
    if (val >= 1000000) return `$${(val / 1000000).toLocaleString()}M`;
    if (val >= 1000) return `$${(val / 1000).toLocaleString()}K`;
    return `$${val.toLocaleString()}`;
  }
}
