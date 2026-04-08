import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FinanceStore } from '../../store/finance.store';
import { ModalButton, ModalComponent } from '../modals/modal.component';

@Component({
  selector: 'app-settings-modal',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="store.isSettingsOpen()"
      [title]="'Financial Scale'"
      [description]="'How each weight of marble translates to currency'"
      widthClass="w-full max-w-md"
      [buttons]="settingsButtons()"
      (dismiss)="close()"
    >
      <div class="space-y-6">
        <!-- Setting: Marble Value Input (Underlined Style) -->
        <div class="mb-8">
          <label
            for="marbleValueInput"
            class="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2"
            >Marble Value</label
          >
          <div class="relative flex items-center mb-0">
            <span class="absolute left-0 text-slate font-black text-2xl pb-2">$</span>
            <input
              #marbleInput
              id="marbleValueInput"
              type="number"
              [value]="getMarbleValue()"
              (input)="onMarbleInput($event)"
              class="w-full border-b-2 border-slate/10 focus:border-slate outline-none text-2xl font-bold text-slate pl-6 pb-2 transition-colors interactive-element"
            />
          </div>
        </div>

        <!-- Legend Grid -->
        <div class="space-y-0">
          <h3 class="text-[12px] font-bold uppercase text-gray-500 tracking-wider mt-4 mb-0">
            Legend
          </h3>

          <div class="divide-y-2 divide-gray-100">
            <!-- 1 Marble -->
            <div class="flex items-center justify-between py-6 transition-colors">
              <div class="flex items-center gap-6">
                <div class="w-6 h-6 rounded-[4px] bg-asset-blue shadow-sm"></div>
                <span class="text-[16px] font-bold text-slate">1 Marble</span>
              </div>
              <span class="text-[16px] font-black text-slate">{{
                formatUSD(getMarbleValue())
              }}</span>
            </div>

            <!-- 5x5 Block -->
            <div class="flex items-center justify-between py-6 transition-colors">
              <div class="flex items-center gap-6">
                <div
                  class="w-10 h-10 rounded-[6px] bg-asset-blue shadow-sm relative overflow-hidden flex items-center justify-center p-0.5"
                >
                  <div class="grid grid-cols-2 grid-rows-2 gap-[1px] w-full h-full opacity-30">
                    <div class="bg-white rounded-[1px]"></div>
                    <div class="bg-white rounded-[1px]"></div>
                    <div class="bg-white rounded-[1px]"></div>
                    <div class="bg-white rounded-[1px]"></div>
                  </div>
                </div>
                <div class="flex flex-col">
                  <span class="text-[16px] font-bold text-slate">5x5 Block</span>
                  <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1"
                    >25 Marbles</span
                  >
                </div>
              </div>
              <span class="text-[16px] font-black text-slate">{{
                formatUSD(getMarbleValue() * 25)
              }}</span>
            </div>

            <!-- 10x10 Huge Block -->
            <div class="flex items-center justify-between py-6 transition-colors">
              <div class="flex items-center gap-6">
                <div
                  class="w-14 h-14 rounded-[8px] bg-asset-blue shadow-sm relative overflow-hidden flex items-center justify-center p-1"
                >
                  <div class="grid grid-cols-2 grid-rows-2 gap-[2px] w-full h-full opacity-40">
                    <div class="bg-white rounded-[1px]"></div>
                    <div class="bg-white rounded-[1px]"></div>
                    <div class="bg-white rounded-[1px]"></div>
                    <div class="bg-white rounded-[1px]"></div>
                  </div>
                </div>
                <div class="flex flex-col">
                  <span class="text-[16px] font-bold text-slate">10x10 Block</span>
                  <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1"
                    >100 Marbles</span
                  >
                </div>
              </div>
              <span class="text-[18px] font-black text-slate">{{
                formatUSD(getMarbleValue() * 100)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </app-modal>
  `,
})
export class SettingsModalComponent implements AfterViewInit {
  store = inject(FinanceStore);

  readonly marbleInput = viewChild.required<ElementRef<HTMLInputElement>>('marbleInput');

  settingsButtons = computed<ModalButton[]>(() => [
    { label: 'Update', type: 'slate', action: () => this.close() }
  ]);

  ngAfterViewInit() {
    // Small timeout to ensure the modal animation hasn't blocked the focus
    setTimeout(() => {
      this.marbleInput().nativeElement.focus();
      this.marbleInput().nativeElement.select();
    }, 150);
  }

  close() {
    this.store.setSettingsOpen(false);
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
