import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FinanceStore } from '../../store/finance.store';
import { TooltipService } from '../../services/tooltip.service';
import { PanelComponent } from './panel.component';

interface TimelineYear {
  year: string;
  months: { label: string; index: number; isLatest: boolean; mtm: number; ytd: number }[];
  isExpanded: boolean;
  ytd: number;
}

@Component({
  selector: 'app-timeline-panel',
  imports: [DecimalPipe, PanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-panel
      [isOpen]="store.isTimelineOpen()"
      [position]="'left'"
      [width]="'320px'"
      [ariaLabel]="'Portfolio Timeline'"
    >
      <ul class="flex flex-col gap-6 w-full relative list-none p-0 m-0">
        @for (grp of yearsGrouped(); track grp.year; let lastGrp = $last) {
          <li class="flex flex-col w-full relative">
            <button
              class="flex items-center gap-2 cursor-pointer interactive-element mb-1 w-full text-left bg-transparent border-none p-0 appearance-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded group"
              (click)="toggleYear(grp)"
              [attr.aria-expanded]="grp.isExpanded"
              [attr.aria-controls]="'year-content-' + grp.year"
            >
              <time
                [attr.datetime]="grp.year"
                class="text-[18px] font-black tracking-normal"
                [class]="grp.isExpanded ? 'text-slate' : 'text-slate-500'"
                >{{ grp.year }}</time
              >
              @if (grp.months.length > 1) {
                <span
                  class="text-[9px] font-black px-1.5 py-0.5 rounded-full ml-auto transition-opacity group-hover:opacity-75"
                  [class]="
                    grp.ytd >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  "
                  [class.opacity-40]="!grp.isExpanded"
                  [class.opacity-100]="grp.isExpanded"
                >
                  <span class="sr-only">Year to date performance: </span>
                  {{ grp.ytd >= 0 ? '+' : '' }}{{ grp.ytd | number: '1.0-1' }}%
                </span>
              }
            </button>

            @if (grp.isExpanded) {
              <ul
                [id]="'year-content-' + grp.year"
                class="flex flex-col mt-[8px] mb-4 gap-[20px] ml-[14px] relative list-none p-0 m-0"
              >
                <!-- Connective Vertical Line covering all months -->
                <li
                  class="absolute top-[8px] bottom-[10px] left-[3px] w-px bg-slate-300"
                  aria-hidden="true"
                ></li>

                @for (m of grp.months; track m.index; let lastMonth = $last) {
                  <li>
                    <button
                      class="flex items-center gap-4 cursor-pointer interactive-element group pr-2 w-full text-left bg-transparent border-none p-0 appearance-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                      (click)="handleJump(m.index)"
                      [attr.aria-current]="store.activeTimelineIndex() === m.index ? 'page' : null"
                    >
                      <div
                        class="w-1.5 h-1.5 rounded-full z-10 transition-colors relative shrink-0"
                        [class]="
                          store.activeTimelineIndex() === m.index
                            ? 'bg-accent ring-2 ring-accent/20'
                            : 'bg-slate-500 group-hover:bg-slate'
                        "
                      ></div>
                      <!-- Month Label & Badge -->
                      <div class="flex items-center justify-between w-full">
                        <span
                          class="text-[14px] tracking-normal transition-colors"
                          [class]="
                            store.activeTimelineIndex() === m.index
                              ? 'text-slate font-black'
                              : 'text-slate-500 font-medium group-hover:text-slate group-hover:font-semibold'
                          "
                        >
                          {{ m.label }}
                        </span>
                        @if (m.index > 0) {
                          <span
                            class="text-[9px] font-black px-1.5 py-0.5 rounded-full transition-opacity group-hover:opacity-75"
                            [class]="
                              m.mtm >= 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            "
                            [class.opacity-40]="store.activeTimelineIndex() !== m.index"
                            [class.opacity-100]="store.activeTimelineIndex() === m.index"
                          >
                            <span class="sr-only">Month over month: </span>
                            {{ m.mtm >= 0 ? '+' : '' }}{{ m.mtm | number: '1.0-1' }}%
                          </span>
                        }
                      </div>
                    </button>
                  </li>
                }
              </ul>
            }
          </li>
        }
      </ul>
    </app-panel>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class TimelinePanelComponent {

  store = inject(FinanceStore);
  tooltip = inject(TooltipService);

  jumpTo = output<number>();

  expandedYears = signal<Record<string, boolean>>({});

  yearsGrouped = computed(() => {
    const map = new Map<string, TimelineYear>();
    const records = this.store.months();
    const stats = this.store.monthStats();
    const yearlyGroups = this.store.monthsByYear();

    records.forEach((rec, idx) => {
      const str = rec.date.trim();
      const parts = str.split(' ');
      const yy = parts[parts.length - 1];
      const mmStr = parts.slice(0, parts.length - 1).join(' ');

      const fullMonths: Record<string, string> = {
        jan: 'January',
        feb: 'February',
        mar: 'March',
        apr: 'April',
        may: 'May',
        jun: 'June',
        jul: 'July',
        aug: 'August',
        sep: 'September',
        oct: 'October',
        nov: 'November',
        dec: 'December',
      };
      const l = mmStr.toLowerCase().substring(0, 3);
      const fullLabel = fullMonths[l] || mmStr;

      if (!map.has(yy)) {
        const yGroup = yearlyGroups.find((g) => g.year === yy);
        map.set(yy, {
          year: yy,
          ytd: yGroup ? yGroup.ytd : 0,
          months: [],
          isExpanded: false,
        });
      }

      const monthStat = stats.get(rec.id) || { mtm: 0, ytd: 0 };
      map.get(yy)!.months.push({
        label: fullLabel,
        index: idx,
        isLatest: idx === records.length - 1,
        mtm: monthStat.mtm,
        ytd: monthStat.ytd,
      });
    });

    const arr = Array.from(map.values()).sort((a, b) => parseInt(a.year) - parseInt(b.year));
    const exp = this.expandedYears();

    if (Object.keys(exp).length === 0 && arr.length > 0) {
      arr[arr.length - 1].isExpanded = true;
    } else {
      arr.forEach((a) => {
        if (exp[a.year] !== undefined) {
          a.isExpanded = exp[a.year];
        } else if (a.months.some((m) => m.index === this.store.activeTimelineIndex())) {
          a.isExpanded = true;
        }
      });
    }
    return arr;
  });

  toggleYear(grp: TimelineYear) {
    const cur = this.expandedYears();
    const currentExp = grp.isExpanded;
    this.expandedYears.set({ ...cur, [grp.year]: !currentExp });
  }

  handleJump(idx: number) {
    this.store.setActiveTimelineIndex(idx);
    this.jumpTo.emit(idx);
  }
}

