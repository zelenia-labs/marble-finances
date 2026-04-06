import { computed, effect } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState, withHooks } from '@ngrx/signals';
import { TAILWIND_COLOR_MAP } from '../utils/color.util';
import { DEMO_DATA } from '../data/demo.data';

export interface Asset {
  id: string;
  label: string;
  val: number;
  note?: string | null;
}

export interface ActionItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface AssetCategory {
  id: string;
  label: string;
  color: string;
  assets: Asset[];
}

export interface CashFlowItem {
  id: string;
  label: string;
  val: number;
  color: string;
  type: string;
  parentCategory: 'expense' | 'savings';
}

export interface MonthRecord {
  id: string;
  date: string;
  grossAnnual: string;
  netAnnual: string;
  netMonthly: string;
  flow: CashFlowItem[];
  assetCategories: AssetCategory[];
  actionItems: ActionItem[];
}

export interface MonthSnapshot {
  label: string;
  total: number;
}

export interface ForwardAction {
  type: 'flowAmount' | 'flowLabel' | 'assetAmount' | 'categoryLabel' | 'assetLabel' | 'assetNote' | 'overview' | 'addCategory' | 'addAsset' | 'addFlow' | 'deleteCategory' | 'deleteAsset' | 'deleteFlow';
  field?: 'grossAnnual' | 'netAnnual' | 'netMonthly' | 'date';
  monthIdx: number;
  idx: number;
  subIdx?: number;
  targetId?: string;
  parentId?: string;
  value: unknown;
  staged?: boolean;
}

export interface ChangelogEntry {
  id: string;
  label: string;
  details?: string;
  timestamp: number;
  months: MonthRecord[];
  multiplier: number;
  customColors: string[];
}

export interface MarbleFinancesState {
  months: MonthRecord[];

  // UI State
  marbleMultiplier: number;
  isSettingsOpen: boolean;
  isFlowPanelOpen: boolean;
  newAssetColor: string;
  tempCustomColor: string;
  customColors: string[];
  forwardTarget: ForwardAction | null;
  deleteTarget: { monthIndex: number; type: 'asset' | 'flow'; index: number; subIndex: number | null } | null;
  activeMenuId: string | null;
  isAddModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isTimelineOpen: boolean;
  isChartsModalOpen: boolean;
  addModalMode: 'palette' | 'custom';
  addModalType: 'asset' | 'breakdown' | 'flow-expense' | 'flow-savings';
  activeModalMonthIndex: number; // Identifies which canvas triggered the add action
  activeTimelineIndex: number;
  addBreakdownParentIndex: number | null;

  snapshots: Record<string, MonthSnapshot | null>;
  autoApplyForward: boolean;
  isCompareModalOpen: boolean;
  compareState: { baseMonthId: string; targetMonthId: string } | null;
  isCompareRibbonVisible: boolean;

  // Tooltip State
  assetsGridSize: number;
  flowGridSize: number;

  // Changelog State
  changelog: ChangelogEntry[];
  isChangelogOpen: boolean;
  revertTarget: ChangelogEntry | null;
  isRevertModalOpen: boolean;
}


const initialState: MarbleFinancesState = {
  months: [],
  marbleMultiplier: 1000,
  isSettingsOpen: false,
  isFlowPanelOpen: false,
  newAssetColor: 'bg-assetBlue',
  tempCustomColor: '#82C4C3',  // matches --color-assetTeal
  customColors: [],
  forwardTarget: null,
  deleteTarget: null,
  activeMenuId: null,
  isAddModalOpen: false,
  isDeleteModalOpen: false,
  isTimelineOpen: false,
  isChartsModalOpen: false,
  addModalMode: 'palette',
  addModalType: 'asset',
  activeModalMonthIndex: 0,
  activeTimelineIndex: 0,
  addBreakdownParentIndex: null,
  snapshots: {},
  autoApplyForward: false,
  isCompareModalOpen: false,
  compareState: null,
  isCompareRibbonVisible: false,
  assetsGridSize: 5,
  flowGridSize: 5,
  changelog: [],
  isChangelogOpen: false,
  revertTarget: null,
  isRevertModalOpen: false,
};

const STORAGE_KEY = 'marble_finance_multi_data';


function getInitialState(): MarbleFinancesState {
  // Safe check for localStorage (prevents ReferenceError in headless/SSR environments)
  const storage = typeof window !== 'undefined' ? window.localStorage : null;
  const saved = storage?.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.months) {
        parsed.months = parsed.months.map((m: MonthRecord) => ({
          ...m,
          assetCategories: m.assetCategories.filter(cat =>
            cat.assets.reduce((sum, a) => sum + a.val, 0) > 0
          )
        }));
      }
      return { ...initialState, ...parsed };
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
  }
  
  // Initialize changelog from sessionStorage
  const sessionStored = typeof window !== 'undefined' ? window.sessionStorage : null;
  const savedChangelog = sessionStored?.getItem('marble_changelog');
  let changelog: ChangelogEntry[] = [];
  if (savedChangelog) {
    try {
      changelog = JSON.parse(savedChangelog);
    } catch (e) {
      console.error('Failed to parse changelog', e);
    }
  }

  // Fallback to demo data if nothing in localStorage
  // Restore changelog if available (though withHooks usually handles this better)
  return { 
    ...initialState, 
    months: DEMO_DATA.months,
    marbleMultiplier: DEMO_DATA.marbleMultiplier,
    snapshots: DEMO_DATA.snapshots,
    customColors: DEMO_DATA.customColors,
    changelog
  };
}

export function sumAssets(assetCategories: AssetCategory[]): number {
  return assetCategories.reduce((total, a) => total + a.assets.reduce((s, sa) => s + sa.val, 0), 0);
}

/**
 * Strips transient noise before any persistence (localStorage or file export):
 * - Removes action items with an empty label (abandoned placeholders)
 * - Omits the `note` field from assets when it is an empty string or null
 *   (the field is optional in the Asset interface, so omitting it is safe)
 */
export function sanitizeMonths(months: MonthRecord[]): MonthRecord[] {
  return months.map(month => ({
    ...month,
    actionItems: month.actionItems.filter(item => item.label.trim() !== ''),
    assetCategories: month.assetCategories.map(cat => ({
      ...cat,
      assets: cat.assets.map(({ note, ...rest }) =>
        note != null && note !== '' ? { ...rest, note } : rest
      )
    }))
  }));
}

/** 
 * Human-friendly currency formatting following the convention:
 * - $1000 = $1K
 * - $1000000 = $1M
 */
export function formatHumanUSD(marbles: number, multiplier: number): string {
  const val = marbles * multiplier;
  if (Math.abs(val) >= 1000000) {
    const m = val / 1000000;
    return `$${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (Math.abs(val) >= 1000) {
    const k = val / 1000;
    return `$${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `$${Math.round(val)}`;
}

export const FinanceStore = signalStore(
  { providedIn: 'root' },
  withState(getInitialState()),
  withMethods((store) => {
    effect(() => {
      const state = {
        months: sanitizeMonths(store.months()),
        marbleMultiplier: store.marbleMultiplier(),
        assetsGridSize: store.assetsGridSize(),
        flowGridSize: store.flowGridSize(),
        snapshots: store.snapshots(),
        customColors: store.customColors()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });

    effect(() => {
      const changelog = store.changelog();
      sessionStorage.setItem('marble_changelog', JSON.stringify(changelog));
    });
    return {};
  }),
  withComputed((store) => ({
    monthsByYear: computed(() => {
      const months = store.months();
      const groups: { year: string, ytd: number, items: { month: MonthRecord, index: number }[] }[] = [];

      months.forEach((m, index) => {
        const year = m.date.split(' ').pop() || 'Unknown';
        let group = groups.find(g => g.year === year);
        if (!group) {
          group = { year, ytd: 0, items: [] };
          groups.push(group);
        }
        group.items.push({ month: m, index });
      });

      // Calculate YTD performance for each group
      groups.forEach(g => {
        if (g.items.length > 0) {
          const startVal = sumAssets(g.items[0].month.assetCategories);
          const endVal = sumAssets(g.items[g.items.length - 1].month.assetCategories);
          g.ytd = startVal === 0 ? 0 : ((endVal - startVal) / startVal) * 100;
        }
      });

      return groups;
    }),
    monthStats: computed(() => {
      const months = store.months();
      const stats = new Map<string, { mtm: number, ytd: number, currentTotal: number, cashPercent: number, investmentsPercent: number, liquidNetWorth: number }>();

      months.forEach((m, idx) => {
        const currentTotal = sumAssets(m.assetCategories);
        let mtm = 0;
        let ytd = 0;

        if (idx > 0) {
          const prevTotal = sumAssets(months[idx - 1].assetCategories);
          mtm = prevTotal === 0 ? 0 : ((currentTotal - prevTotal) / prevTotal) * 100;
        }

        const year = m.date.split(' ').pop();
        const earliestThisYear = months.find(month => month.date.endsWith(year!));
        if (earliestThisYear) {
          const firstTotal = sumAssets(earliestThisYear.assetCategories);
          ytd = firstTotal === 0 ? 0 : ((currentTotal - firstTotal) / firstTotal) * 100;
        }

        const cashTotal = m.assetCategories
          .filter(a => a.label.toLowerCase().trim() === 'cash')
          .reduce((t, a) => t + a.assets.reduce((s, sa) => s + sa.val, 0), 0);

        const investmentsTotal = m.assetCategories
          .filter(a => {
            const l = a.label.toLowerCase().trim();
            return l === 'investments' || l === 'retirement' || l === 'crypto' || l === 'stocks';
          })
          .reduce((t, a) => t + a.assets.reduce((s, sa) => s + sa.val, 0), 0);

        const sparklineDisplayTotal = cashTotal + investmentsTotal;
        const cashPercent = sparklineDisplayTotal === 0 ? 0 : (cashTotal / sparklineDisplayTotal) * 100;
        const investmentsPercent = sparklineDisplayTotal === 0 ? 0 : (investmentsTotal / sparklineDisplayTotal) * 100;

        stats.set(m.id, { mtm, ytd, currentTotal, cashPercent, investmentsPercent, liquidNetWorth: sparklineDisplayTotal });
      });
      return stats;
    }),
    chartData: computed(() => {
      const months = store.months();
      const labels = months.map(m => m.date);

      // We need consistent categories across all months. Group by label to be robust.
      const categoryMap = new Map<string, { label: string; color: string }>();
      months.forEach(m => {
        m.assetCategories.forEach(c => {
          const key = c.label.toLowerCase().trim();
          if (!categoryMap.has(key)) {
            let hexColor = c.color;
            if (c.color.startsWith('bg-')) hexColor = TAILWIND_COLOR_MAP[c.color] || '#A0AAB2'; // fallback to assetStone
            categoryMap.set(key, { label: c.label, color: hexColor });
          }
        });
      });

      const compositionDatasets = Array.from(categoryMap.entries()).map(([key, info]) => {
        const data = months.map(m => {
          const cat = m.assetCategories.find(c => c.label.toLowerCase().trim() === key);
          return cat ? cat.assets.reduce((sum, a) => sum + a.val, 0) : 0;
        });
        return {
          label: info.label,
          data,
          stack: 'a',
          fill: true,
          backgroundColor: info.color,
          borderColor: info.color,
          borderWidth: 1,
          pointRadius: 2,
          tension: 0.4
        };
      });

      const totalValueData = months.map(m => sumAssets(m.assetCategories));
      const totalValueDataset = [{
        label: 'Total Value',
        data: totalValueData,
        borderColor: '#10B981',       // --color-positive
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 2,
        tension: 0.1,
        fill: true
      }];

      return { labels, compositionDatasets, totalValueData, totalValueDataset };
    }),
    changelogInverse: computed(() => {
      return [...store.changelog()].reverse();
    })
  })),
  withMethods((store) => ({
    setSettingsOpen(isOpen: boolean) {
      patchState(store, { isSettingsOpen: isOpen });
    },
    setMarbleMultiplier(val: number) {
      patchState(store, { marbleMultiplier: val });
    },
    setAssetsGridSize(val: number) {
      patchState(store, { assetsGridSize: val });
    },
    setFlowGridSize(val: number) {
      patchState(store, { flowGridSize: val });
    },
    toggleFlowPanel() {
      patchState(store, (state) => ({ isFlowPanelOpen: !state.isFlowPanelOpen }));
    },
    toggleTimeline() {
      patchState(store, (state) => ({ isTimelineOpen: !state.isTimelineOpen }));
    },
    toggleCharts(isOpen?: boolean) {
      patchState(store, (state) => ({ isChartsModalOpen: isOpen !== undefined ? isOpen : !state.isChartsModalOpen }));
    },
    setActiveMenuId(activeMenuId: string | null) {
      patchState(store, { activeMenuId });
    },
    setActiveTimelineIndex(idx: number) {
      patchState(store, { activeTimelineIndex: idx });
    },

    toggleChangelog() {
      patchState(store, (state) => ({ isChangelogOpen: !state.isChangelogOpen }));
    },

    closeRevertModal() {
      patchState(store, { isRevertModalOpen: false, revertTarget: null });
    },

    promptRevert(item: ChangelogEntry) {
      patchState(store, { revertTarget: item, isRevertModalOpen: true, isChangelogOpen: false });
    },

    undo() {
      const changelog = store.changelog();
      if (changelog.length < 2) return; 

      const previous = changelog[changelog.length - 2];
      
      patchState(store, {
        months: structuredClone(previous.months),
        marbleMultiplier: previous.multiplier,
        customColors: [...previous.customColors],
        changelog: changelog.slice(0, -1)
      });
    },

    confirmRevert() {
      const target = store.revertTarget();
      if (!target) return;

      const changelog = store.changelog();
      const targetIdx = changelog.findIndex(h => h.id === target.id);
      if (targetIdx === -1) return;

      patchState(store, {
        months: structuredClone(target.months),
        marbleMultiplier: target.multiplier,
        customColors: [...target.customColors],
        changelog: changelog.slice(0, targetIdx + 1),
        isRevertModalOpen: false,
        revertTarget: null
      });
    },

    recordChange(label: string, details?: string) {
      const entry: ChangelogEntry = {
        id: 'cl_' + Date.now() + Math.random().toString(36).substring(2, 9),
        label,
        details,
        timestamp: Date.now(),
        months: structuredClone(store.months()),
        multiplier: store.marbleMultiplier(),
        customColors: [...store.customColors()],
      };

      patchState(store, (state) => {
        const changelog = [...state.changelog, entry];
        return { changelog: changelog.slice(-50) };
      });
    }
,

    // Comparison Logic
    openCompareModal() {
      patchState(store, { isCompareModalOpen: true });
    },
    closeCompareModal() {
      patchState(store, { isCompareModalOpen: false });
    },
    startComparison(baseMonthId: string, targetMonthId: string) {
      patchState(store, {
        compareState: { baseMonthId, targetMonthId },
        isCompareModalOpen: false,
        isCompareRibbonVisible: false
      });
    },
    clearComparison() {
      patchState(store, {
        compareState: null,
        isCompareRibbonVisible: false
      });
    },
    setCompareRibbonVisible(visible: boolean) {
      patchState(store, { isCompareRibbonVisible: visible });
    },

    // Add Month Logic: Clone a month into a new date
    duplicateMonth(sourceIdx: number, customDate?: string) {
      patchState(store, (state) => {
        const sourceMonth = state.months[sourceIdx];
        let nextDateStr = customDate;
        let nextId: string;

        if (!nextDateStr) {
          // Fallback to sequential next month logic if no custom date provided
          const lastMonth = state.months[state.months.length - 1];
          const dateParts = lastMonth.date.trim().split(' ');
          const mStr = dateParts[0];
          let yNum = parseInt(dateParts[1]);
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          let mIdx = monthNames.findIndex(m => m.toLowerCase().startsWith(mStr.toLowerCase()));
          if (mIdx === -1) mIdx = 0;

          if (mIdx === 11) {
            mIdx = 0;
            yNum++;
          } else {
            mIdx++;
          }

          nextDateStr = `${monthNames[mIdx]} ${yNum}`;
          nextId = `${monthNames[mIdx]}_${yNum}_${Date.now()}`;
        } else {
          nextId = `${nextDateStr.replace(' ', '_')}_${Date.now()}`;
        }

        // Filter incomplete actions from the source
        const incompleteActions = sourceMonth.actionItems.filter(i => !i.completed).map(i => ({ ...i }));

        const newMonth: MonthRecord = {
          id: nextId,
          date: nextDateStr,
          grossAnnual: sourceMonth.grossAnnual,
          netAnnual: sourceMonth.netAnnual,
          netMonthly: sourceMonth.netMonthly,
          actionItems: incompleteActions,
          flow: structuredClone(sourceMonth.flow),
          assetCategories: structuredClone(sourceMonth.assetCategories)
        };

        // Sort all months by date after addition to keep the matrix stable
        const updatedMonths = [...state.months, newMonth].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        return { months: updatedMonths };
      });
      const monthDate = store.months()[sourceIdx].date;
      this.recordChange('Duplicated Month', `Created a copy of ${monthDate}`);
    },

    applyLocalUpdate(action: ForwardAction) {
      this.executeForwardAction(action, false);
    },

    promptForwardTarget(action: ForwardAction) {
      const idx = action.monthIdx;
      if (idx < store.months().length - 1) {
        patchState(store, { forwardTarget: action });
      }
    },

    promptForwardUpdate(action: ForwardAction) {
      const isPriorMonth = action.monthIdx < store.months().length - 1;

      // GATEKEEPER RULE: If prior month and NOT already auto-applying, we STOP ALL SYNC.
      // We do NOT call applyLocalUpdate yet. The value stays "pending" in the UI.
      if (isPriorMonth && !store.autoApplyForward()) {
        action.staged = true; // Mark as staged/pending
        patchState(store, { forwardTarget: action });
        return; // STOP EXECUTION
      }

      // If auto-apply is ON or it's current/future month, proceed to write.
      this.applyLocalUpdate(action);

      // If it was a prior month with auto-apply, also trigger the cascade immediately.
      if (isPriorMonth && store.autoApplyForward()) {
        this.executeForwardAction(action, true);
      }
    },

    setAutoApplyForward(val: boolean) {
      patchState(store, { autoApplyForward: val });
    },

    cancelForwardUpdate() {
      patchState(store, { forwardTarget: null });
    },

    executeForwardAction(targetAction?: ForwardAction, cascade = false) {


      patchState(store, (state) => {
        const action = targetAction || state.forwardTarget;
        if (!action) return state;

        const months = structuredClone(state.months);
        const i = action.monthIdx;

        // 1. Update SINGLE_MONTH (The current target month)
        this._applyMutation(months, i, action);

        // 2. CASCADING_FUTURE (Update all subsequent months if requested)
        if (cascade) {
          for (let j = i + 1; j < months.length; j++) {
            this._applyMutation(months, j, action, true);
          }
        }

        return { months, forwardTarget: null };
      });

      const action = targetAction || store.forwardTarget();
      if (action) {
        const actionLabels: Record<string, string> = {
          'flowAmount': 'Updated flow amount',
          'flowLabel': 'Updated flow label',
          'assetAmount': 'Updated asset balance',
          'categoryLabel': 'Updated category name',
          'assetLabel': 'Updated asset name',
          'assetNote': 'Updated asset note',
          'overview': 'Updated overview',
          'addCategory': 'Added category',
          'addAsset': 'Added asset',
          'addFlow': 'Added cash flow',
          'deleteCategory': 'Deleted category',
          'deleteAsset': 'Deleted asset',
          'deleteFlow': 'Deleted cash flow',
          'toggleActionItem': 'Toggled Task'
        };
        const monthDate = store.months()[action.monthIdx]?.date || '';
        const label = actionLabels[action.type] || 'Updated Portfolio';
        
        // Try to find the specific label for more descriptive changelog
        let itemName = '';
        const month = store.months()[action.monthIdx];
        if (month) {
          if (action.type.includes('flow') && action.targetId) {
            itemName = month.flow.find(f => f.id === action.targetId)?.label || '';
          } else if (action.type.includes('asset') && action.targetId) {
            const cat = action.parentId ? month.assetCategories.find(c => c.id === action.parentId) : null;
            if (cat) itemName = cat.assets.find(a => a.id === action.targetId)?.label || '';
            else itemName = month.assetCategories.find(c => c.id === action.targetId)?.label || '';
          } else if (action.type.includes('category') && action.targetId) {
            itemName = month.assetCategories.find(c => c.id === action.targetId)?.label || '';
          }
        }

        let details = itemName ? `Updated "${itemName}" in ${monthDate}` : `${label} in ${monthDate}`;
        
        // Enhance details for deletions
        if (action.type.startsWith('delete') && itemName) {
          let extraInfo = '';
          const month = store.months()[action.monthIdx];
          if (month) {
            if (action.type === 'deleteFlow') {
              const flowItem = month.flow.find(f => f.id === action.targetId);
              if (flowItem) extraInfo = ` (${formatHumanUSD(flowItem.val, store.marbleMultiplier())})`;
            } else if (action.type === 'deleteAsset') {
              const cat = month.assetCategories.find(c => c.id === action.parentId);
              const asset = cat?.assets.find(a => a.id === action.targetId);
              if (asset) extraInfo = ` (${formatHumanUSD(asset.val, store.marbleMultiplier())})`;
            } else if (action.type === 'deleteCategory') {
              const cat = month.assetCategories.find(c => c.id === action.targetId);
              if (cat) {
                const total = cat.assets.reduce((sum, a) => sum + a.val, 0);
                extraInfo = ` (Total: ${formatHumanUSD(total, store.marbleMultiplier())})`;
              }
            }
          }
          details = `Removed "${itemName}"${extraInfo} from ${monthDate}`;
        }
        else if (action.type === 'overview') {
            details = `Changed ${action.field} to "${action.value}" in ${monthDate}`;
        } else if (typeof action.value === 'object' && action.value !== null && 'label' in action.value) {
            details = `${label}: ${(action.value as {label: string}).label} in ${monthDate}`;
        } else if (typeof action.value === 'number' || typeof action.value === 'string') {
            details = itemName 
              ? `Changed "${itemName}" to ${action.value} in ${monthDate}`
              : `${label} to ${action.value} in ${monthDate}`;
        }

        this.recordChange(label, details);
      }
    },

    // Internal helper to keep mutation logic DRY and strictly mapped to IDs
    _applyMutation(months: MonthRecord[], idx: number, action: ForwardAction, isCascade = false) {
      if (action.type === 'flowAmount') {
        const item = isCascade ? months[idx].flow.find(f => f.id === action.targetId) : months[idx].flow[action.idx];
        if (item) item.val = typeof action.value === 'string' ? parseFloat(action.value) : action.value as number;
      }
      else if (action.type === 'flowLabel') {
        const item = isCascade ? months[idx].flow.find(f => f.id === action.targetId) : months[idx].flow[action.idx];
        if (item) item.label = action.value as string;
      }
      else if (action.type === 'assetAmount') {
        const asset = isCascade ? months[idx].assetCategories.find(a => a.id === action.parentId) : months[idx].assetCategories[action.idx];
        if (asset) {
          const sub = isCascade ? asset.assets.find(s => s.id === action.targetId) : asset.assets[action.subIdx!];
          if (sub) sub.val = typeof action.value === 'string' ? parseFloat(action.value) : action.value as number;
        }
      }
      else if (action.type === 'categoryLabel') {
        const asset = isCascade ? months[idx].assetCategories.find(a => a.id === action.targetId) : months[idx].assetCategories[action.idx];
        if (asset) asset.label = action.value as string;
      }
      else if (action.type === 'assetLabel') {
        const asset = isCascade ? months[idx].assetCategories.find(a => a.id === action.parentId) : months[idx].assetCategories[action.idx];
        if (asset) {
          const sub = isCascade ? asset.assets.find(s => s.id === action.targetId) : asset.assets[action.subIdx!];
          if (sub) sub.label = action.value as string;
        }
      }
      else if (action.type === 'assetNote') {
        const asset = isCascade ? months[idx].assetCategories.find(a => a.id === action.parentId) : months[idx].assetCategories[action.idx];
        if (asset) {
          const sub = isCascade ? asset.assets.find(s => s.id === action.targetId) : asset.assets[action.subIdx!];
          if (sub) sub.note = action.value as string | null | undefined;
        }
      }
      else if (action.type === 'addCategory') {
        if (isCascade) {
          months[idx].assetCategories.unshift(structuredClone(action.value as AssetCategory));
        } else {
          months[idx].assetCategories.splice(action.idx, 0, action.value as AssetCategory);
        }
      }
      else if (action.type === 'addAsset') {
        const asset = isCascade ? months[idx].assetCategories.find(a => a.id === action.parentId) : months[idx].assetCategories[action.idx];
        if (asset) asset.assets.push(structuredClone(action.value as Asset));
      }
      else if (action.type === 'addFlow') {
        if (isCascade) {
          months[idx].flow.push(structuredClone(action.value as CashFlowItem));
        } else {
          months[idx].flow.splice(action.idx, 0, action.value as CashFlowItem);
        }
      }
      else if (action.type === 'deleteCategory') {
        months[idx].assetCategories = months[idx].assetCategories.filter(a => a.id !== action.targetId);
      }
      else if (action.type === 'deleteAsset') {
        const asset = isCascade ? months[idx].assetCategories.find(a => a.id === action.parentId) : months[idx].assetCategories[action.idx];
        if (asset) asset.assets = asset.assets.filter(s => s.id !== action.targetId);
      }
      else if (action.type === 'deleteFlow') {
        months[idx].flow = months[idx].flow.filter(f => f.id !== action.targetId);
      }
      else if (action.type === 'overview') {
        months[idx][action.field!] = action.value as string;
      }
    },



    addNote(monthIdx: number, assetIdx: number, subIndex: number) {
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        months[monthIdx].assetCategories[assetIdx].assets[subIndex].note = '';
        return { months };
      });
    },

    toggleActionItem(monthIdx: number, id: string) {
      let itemLabel = '';
      let isCompleted = false;
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        const item = months[monthIdx].actionItems.find(i => i.id === id);
        if (item) {
          item.completed = !item.completed;
          itemLabel = item.label;
          isCompleted = item.completed;
        }
        return { months };
      });
      this.recordChange('Toggled Checklist Item', `"${itemLabel || 'Untitled'}" is now ${isCompleted ? 'completed' : 'active'}`);
    },

    addActionItem(monthIdx: number) {
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        months[monthIdx].actionItems.push({ id: 'todo_' + Date.now(), label: '', completed: false });
        return { months };
      });
      this.recordChange('Added Checklist Item');
    },

    updateActionItem(monthIdx: number, id: string, label: string) {
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        const item = months[monthIdx].actionItems.find(i => i.id === id);
        if (item) item.label = label;
        return { months };
      });
      // We don't record history on every character typed. 
      // This is usually called on blur or debounced.
      // But let's record it anyway for now, or maybe only if it changed significantly.
    },

    deleteActionItem(monthIdx: number, id: string) {
      let removedLabel = '';
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        const item = months[monthIdx].actionItems.find(i => i.id === id);
        if (item) removedLabel = item.label;
        months[monthIdx].actionItems = months[monthIdx].actionItems.filter(i => i.id !== id);
        return { months };
      });
      this.recordChange('Deleted Checklist Item', `Removed "${removedLabel || 'Untitled'}"`);
    },



    reorderAssets(monthIdx: number, fromIndex: number, toIndex: number) {
      let catLabel = '';
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        catLabel = months[monthIdx].assetCategories[fromIndex].label;
        const [moved] = months[monthIdx].assetCategories.splice(fromIndex, 1);
        months[monthIdx].assetCategories.splice(toIndex, 0, moved);
        return { months };
      });
      const monthDate = store.months()[monthIdx].date;
      this.recordChange('Reordered Categories', `Moved "${catLabel}" in ${monthDate}`);
    },

    moveSubAsset(monthIdx: number, fromAssetIndex: number, fromSubIndex: number, toAssetIndex: number, toSubIndex: number) {
      let assetName = '';
      let fromCat = '';
      let toCat = '';
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        fromCat = months[monthIdx].assetCategories[fromAssetIndex].label;
        toCat = months[monthIdx].assetCategories[toAssetIndex].label;
        assetName = months[monthIdx].assetCategories[fromAssetIndex].assets[fromSubIndex].label;
        const [moved] = months[monthIdx].assetCategories[fromAssetIndex].assets.splice(fromSubIndex, 1);
        months[monthIdx].assetCategories[toAssetIndex].assets.splice(toSubIndex, 0, moved);
        return { months };
      });
      const monthDate = store.months()[monthIdx].date;
      this.recordChange('Moved Asset', `Moved "${assetName}" from ${fromCat} to ${toCat} in ${monthDate}`);
    },

    promptDelete(monthIdx: number, type: 'asset' | 'flow', index: number, subIndex: number | null = null) {
      patchState(store, {
        deleteTarget: { monthIndex: monthIdx, type, index, subIndex },
        isDeleteModalOpen: true,
        activeMenuId: null,
      });
    },

    closeDeleteModal() {
      patchState(store, { isDeleteModalOpen: false });
      setTimeout(() => patchState(store, { deleteTarget: null }), 200);
    },

    executeDelete() {
      const target = store.deleteTarget();
      if (!target) return;

      const typeMap: Record<string, 'deleteFlow' | 'deleteCategory' | 'deleteAsset'> = {
        'flow': 'deleteFlow',
        'asset': target.subIndex !== null ? 'deleteAsset' : 'deleteCategory'
      };

      const month = store.months()[target.monthIndex];
      let targetId: string;
      let parentId = '';

      if (target.type === 'flow') {
        targetId = month.flow[target.index].id;
      } else {
        if (target.subIndex !== null) {
          targetId = month.assetCategories[target.index].assets[target.subIndex].id;
          parentId = month.assetCategories[target.index].id;
        } else {
          targetId = month.assetCategories[target.index].id;
        }
      }

      const action: ForwardAction = {
        type: typeMap[target.type] as 'deleteFlow' | 'deleteCategory' | 'deleteAsset',
        monthIdx: target.monthIndex,
        idx: target.index,
        subIdx: target.subIndex !== null ? target.subIndex : undefined,
        targetId,
        parentId,
        value: null
      };

      // DECOMPRESSION SEQUENCE: Close current modal, wait 1s, then show next modal
      patchState(store, { isDeleteModalOpen: false, deleteTarget: null });

      setTimeout(() => {
        this.promptForwardUpdate(action);
      }, 1000);
    },

    openAddModal(monthIdx: number) {
      patchState(store, {
        activeModalMonthIndex: monthIdx,
        isAddModalOpen: true,
        addModalType: 'asset',
        addModalMode: 'palette',
        newAssetColor: 'bg-assetBlue',
        tempCustomColor: '#A0AAB2'  // --color-assetStone — neutral fallback
      });
    },

    openAddBreakdownModal(monthIdx: number, parentIndex: number) {
      patchState(store, {
        activeModalMonthIndex: monthIdx,
        isAddModalOpen: true,
        addModalType: 'breakdown',
        addBreakdownParentIndex: parentIndex
      });
    },

    openAddFlowModal(monthIdx: number, parentCategory: 'expense' | 'savings') {
      patchState(store, {
        activeModalMonthIndex: monthIdx,
        isAddModalOpen: true,
        addModalType: parentCategory === 'expense' ? 'flow-expense' : 'flow-savings',
      });
    },

    closeAddModal() {
      patchState(store, { isAddModalOpen: false });
    },

    updateOverview(monthIdx: number, field: 'grossAnnual' | 'netAnnual' | 'netMonthly' | 'date', val: string) {
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        months[monthIdx][field] = val;
        return { months };
      });
      const monthDate = store.months()[monthIdx].date;
      this.recordChange('Updated Month Overview', `Changed ${field} for ${monthDate} to ${val}`);
    },

    setAddModalMode(mode: 'palette' | 'custom') { patchState(store, { addModalMode: mode }); },
    selectColorRef(color: string) { patchState(store, { newAssetColor: color }); },
    setTempCustomColor(color: string) { patchState(store, { tempCustomColor: color }); },
    confirmCustomColor() {
      patchState(store, (state) => {
        const newAssetColor = state.tempCustomColor;
        const customColors = [...state.customColors];
        if (!newAssetColor.startsWith('bg-') && !customColors.includes(newAssetColor)) customColors.push(newAssetColor);
        return { newAssetColor, customColors, addModalMode: 'palette' as const };
      });
    },

    confirmAddAsset(name: string, amount: number) {
      let newAssetColor = store.newAssetColor();
      const customColors = [...store.customColors()];
      if (store.addModalMode() === 'custom') {
        newAssetColor = store.tempCustomColor();
        if (!newAssetColor.startsWith('bg-') && !customColors.includes(newAssetColor)) {
          patchState(store, { customColors: [...customColors, newAssetColor] });
        }
      }

      const monthIdx = store.activeModalMonthIndex();
      if (store.addModalType() === 'breakdown') {
        const subId = 'sub_' + Date.now();
        const action: ForwardAction = {
          type: 'addAsset',
          monthIdx: monthIdx,
          idx: store.addBreakdownParentIndex()!,
          parentId: store.months()[monthIdx].assetCategories[store.addBreakdownParentIndex()!].id,
          targetId: subId,
          value: { id: subId, label: name || 'New Subcategory', val: amount }
        };
        this.promptForwardUpdate(action);
      } else {
        const assetId = 'asset_' + Date.now();
        const action: ForwardAction = {
          type: 'addCategory',
          monthIdx: monthIdx,
          idx: 0,
          targetId: assetId,
          value: {
            id: assetId, label: name || 'New AssetCategory', color: newAssetColor,
            assets: [{ id: 'sub_' + Date.now(), label: 'Main Balance', val: amount }]
          }
        };
        this.promptForwardUpdate(action);
      }
      patchState(store, { isAddModalOpen: false, addModalMode: 'palette' });
      const typeLabel = store.addModalType() === 'breakdown' ? 'Added Sub-Asset' : 'Added Asset Category';
      this.recordChange(typeLabel, `Added "${name || 'New Item'}" with value ${amount}`);
    },

    confirmAddFlow(name: string, amount: number, type: string, parentCategory: 'expense' | 'savings') {
      const color = parentCategory === 'savings' ? 'bg-assetBlue' : 'bg-flowOrange';
      const flowId = 'flow_' + Date.now();
      const action: ForwardAction = {
        type: 'addFlow',
        monthIdx: store.activeModalMonthIndex(),
        idx: 0,
        targetId: flowId,
        value: { id: flowId, label: name || 'New Flow', val: amount, color, type, parentCategory }
      };
      this.promptForwardUpdate(action);
      patchState(store, { isAddModalOpen: false });
      this.recordChange('Added Cash Flow', `Added "${name || 'New Flow'}" (${amount}) as ${type} to ${parentCategory}`);
    },

    saveSnapshot(key: string, label: string, total: number) {
      patchState(store, (state) => ({ snapshots: { ...state.snapshots, [key]: { label, total } } }));
    },

    exportData() {
      const currentState = {
        months: sanitizeMonths(store.months()),
        marbleMultiplier: store.marbleMultiplier(),
        snapshots: store.snapshots(),
        customColors: store.customColors()
      };

      const dataStr = JSON.stringify(currentState, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `marbles-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    async importData(file: File) {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        if (parsed && parsed.months) {
          const cleanMonths = parsed.months.map((m: MonthRecord) => ({
            ...m,
            assetCategories: m.assetCategories.filter(cat =>
              cat.assets.reduce((sum, a) => sum + a.val, 0) > 0
            )
          }));
          patchState(store, {
            months: cleanMonths,
            marbleMultiplier: parsed.marbleMultiplier || 1000,
            snapshots: parsed.snapshots || {},
            customColors: parsed.customColors || []
          });
          this.recordChange('Imported Portfolio', `Restored ${cleanMonths.length} months from backup`);
        } else {
          alert('Invalid file format. Cannot load backup.');
        }
      } catch (err) {
        console.error("Failed to parse file", err);
        alert('Could not load the file. It might be corrupted.');
      }
    },

    unloadData() {
      if (confirm('Are you sure you want to clear all data? This action cannot be undone unless you have a backup.')) {
        patchState(store, {
          months: [],
          snapshots: {},
          customColors: []
        });
        localStorage.removeItem(STORAGE_KEY);
      }
    },

    createFreshPortfolio() {
      const now = new Date();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
      const monthId = `${monthNames[now.getMonth()]}_${now.getFullYear()}`;

      const freshMonth: MonthRecord = {
        id: monthId,
        date: monthLabel,
        grossAnnual: '',
        netAnnual: '',
        netMonthly: '',
        flow: [],
        actionItems: [],
        assetCategories: [
          {
            id: `cash_${monthId}`,
            label: 'Cash',
            color: 'bg-assetPurple',
            assets: [{ id: `cash_sub_${monthId}`, label: 'Main Balance', val: 0 }]
          },
          {
            id: `investments_${monthId}`,
            label: 'Investments',
            color: 'bg-assetGreen',
            assets: [{ id: `inv_sub_${monthId}`, label: 'Main Balance', val: 0 }]
          },
          {
            id: `retirement_${monthId}`,
            label: 'Retirement',
            color: 'bg-assetBlue',
            assets: [{ id: `ret_sub_${monthId}`, label: 'Main Balance', val: 0 }]
          }
        ]
      };

      patchState(store, {
        months: [freshMonth],
        marbleMultiplier: 1000,
        snapshots: {},
        customColors: []
      });
      this.recordChange('Created Fresh Portfolio');
    },

    resetToDemoData() {
      if (confirm('Are you sure you want to reset to the original demo data? All local changes will be lost.')) {
        patchState(store, {
          months: DEMO_DATA.months,
          marbleMultiplier: DEMO_DATA.marbleMultiplier,
          snapshots: DEMO_DATA.snapshots,
          customColors: DEMO_DATA.customColors
        });
        localStorage.removeItem(STORAGE_KEY);
      }
    }

  })),
  withHooks(() => ({}))
);
