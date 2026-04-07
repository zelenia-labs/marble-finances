import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';
import { FinanceStore } from '../../store/finance.store';
import { PanelComponent } from './panel.component';

@Component({
  selector: 'app-history-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, PanelComponent],
  template: `
    <app-panel
      [isOpen]="store.isHistoryOpen()"
      [position]="'right'"
      [width]="'420px'"
      [ariaLabel]="'Version History'"
    >
      <ul class="relative list-none p-0 m-0">
        <!-- Vertical Version History Line (Symmetrical to Timeline, but on the right) -->


        @for (item of store.changelogInverse(); track item.id; let first = $first, last = $last) {
          <li class="relative group">
            <!-- Connective Guide Line Segments (Gapless logic) -->
            @if (!first) {
              <div class="absolute right-[17px] top-0 h-[55px] w-px bg-slate-300"></div>
            }
            @if (!last) {
              <div class="absolute right-[17px] top-[55px] bottom-0 w-px bg-slate-300"></div>
            }

            <div
              class="w-full text-left pr-[14px] py-4 rounded-[28px] flex items-start gap-4 group relative border border-transparent transition-colors"
            >
              <div class="flex flex-col flex-1 order-1">
                <!-- Timestamp header -->
                <time [attr.datetime]="item.timestamp | date: 'yyyy-MM-ddTHH:mm:ss'" class="flex items-center gap-1.5 mb-1.5 justify-start">
                  <span class="text-[10px] font-bold text-slate/30 tracking-wider uppercase">
                    {{ item.timestamp | date: 'h:mm a' }}
                  </span>
                  <span class="text-[10px] font-bold text-slate/20 hidden group-hover:block transition-all whitespace-nowrap uppercase">
                     • {{ item.timestamp | date: 'MMM d, y' }}
                  </span>
                </time>

                <div class="flex flex-col gap-0.5">
                  <span class="text-[15px] font-black text-slate/90 tracking-tight leading-tight">
                    {{ item.label }}
                  </span>
                  @if (item.details) {
                    <p class="text-[12px] font-medium text-slate/40 leading-snug tracking-tight">
                      {{ item.details }}
                    </p>
                  }
                </div>
              </div>

              <!-- Right Visual Guide Column: Visual center at 17px from panel end -->
              <div class="relative flex flex-col items-center shrink-0 w-1.5 mt-[39px] order-2">
                <!-- Revert Button: Exactly centered over the dot on hover -->
                <button (click)="store.promptRevert(item)"
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-200 text-slate/60 hover:text-white hover:bg-slate shadow-sm hover:shadow-lg z-30 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-105 interactive-element appearance-none cursor-pointer"
                  (mouseenter)="tooltip.show($event, 'Revert to this version')" (mouseleave)="tooltip.hide()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                    viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                    <path
                      d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192z" />
                  </svg>
                </button>

                <!-- Static Indicator Dot (Gray by default, matches Timeline inactive state) -->
                <div
                  class="w-1.5 h-1.5 rounded-full bg-slate-500 z-10 transition-colors group-hover:opacity-0">
                </div>
              </div>
            </div>
          </li>
        } @empty {
          <div class="flex flex-col items-center justify-center py-24 px-12 text-center opacity-40">
            <div class="w-16 h-16 rounded-full bg-slate/5 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="text-slate/20"
                viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
              </svg>
            </div>
            <h3 class="text-[14px] font-black text-slate tracking-tight mb-2">No Changes Yet</h3>
            <p class="text-[12px] font-medium text-slate tracking-tight leading-relaxed max-w-[200px]">
              Every modification you make to the portfolio will be tracked here for this session.
            </p>
          </div>
        }
      </ul>
      
      <div footer class="pt-6 border-t border-gray-100 italic text-[11px] text-slate/30 font-medium leading-tight text-left">
        Version history is temporary and will be cleared if you refresh the page or close this tab.
      </div>
    </app-panel>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class HistoryPanelComponent {
  store = inject(FinanceStore);
  tooltip = inject(TooltipService);
}
