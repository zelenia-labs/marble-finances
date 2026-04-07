import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DEMO_DATA } from '../data/demo.data';
import { FinanceCalculatorService } from '../services/finance-calculator.service';
import { FinanceMutationService } from '../services/finance-mutation.service';
import { FinancePersistenceService } from '../services/finance-persistence.service';

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

export interface MonthVersion {
  label: string;
  total: number;
}

export interface ForwardAction {
  type:
  | 'flowAmount'
  | 'flowLabel'
  | 'assetAmount'
  | 'categoryLabel'
  | 'assetLabel'
  | 'assetNote'
  | 'overview'
  | 'addCategory'
  | 'addAsset'
  | 'addFlow'
  | 'deleteCategory'
  | 'deleteAsset'
  | 'deleteFlow'
  | 'toggleActionItem';
  field?: 'grossAnnual' | 'netAnnual' | 'netMonthly' | 'date';
  monthIdx: number;
  idx: number;
  subIdx?: number;
  targetId?: string;
  parentId?: string;
  value: unknown;
  staged?: boolean;
}

export interface ImportedPortfolio {
  months: MonthRecord[];
  marbleMultiplier?: number;
  customColors?: string[];
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
  marbleMultiplier: number;
  isSettingsOpen: boolean;
  isFlowPanelOpen: boolean;
  newAssetColor: string;
  tempCustomColor: string;
  customColors: string[];
  forwardTarget: ForwardAction | null;
  deleteTarget: {
    monthIndex: number;
    type: 'asset' | 'flow';
    index: number;
    subIndex: number | null;
  } | null;
  activeMenuId: string | null;
  isAddModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isTimelineOpen: boolean;
  isChartsModalOpen: boolean;
  addModalMode: 'palette' | 'custom';
  addModalType: 'asset' | 'breakdown' | 'flow-expense' | 'flow-savings';
  activeModalMonthIndex: number;
  activeTimelineIndex: number;
  addBreakdownParentIndex: number | null;
  versionSummaries: Record<string, MonthVersion | null>;
  autoApplyForward: boolean;
  isCompareModalOpen: boolean;
  compareState: { baseMonthId: string; targetMonthId: string } | null;
  isCompareRibbonVisible: boolean;
  assetsGridSize: number;
  flowGridSize: number;
  changelog: ChangelogEntry[];
  isHistoryOpen: boolean;
  revertTarget: ChangelogEntry | null;
  isRevertModalOpen: boolean;
}

const initialState: MarbleFinancesState = {
  months: [],
  marbleMultiplier: 1000,
  isSettingsOpen: false,
  isFlowPanelOpen: false,
  newAssetColor: 'bg-assetBlue',
  tempCustomColor: '#82C4C3',
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
  versionSummaries: {},
  autoApplyForward: false,
  isCompareModalOpen: false,
  compareState: null,
  isCompareRibbonVisible: false,
  assetsGridSize: 5,
  flowGridSize: 5,
  changelog: [],
  isHistoryOpen: false,
  revertTarget: null,
  isRevertModalOpen: false,
};

/**
 * Human-friendly currency formatting (Utility)
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

export function sumAssets(assetCategories: AssetCategory[]): number {
  return assetCategories.reduce((total, a) => total + a.assets.reduce((s, sa) => s + sa.val, 0), 0);
}

export const FinanceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  // Block 1: Basic State Management & Persistence Helpers
  withMethods((store,
    persistence = inject(FinancePersistenceService)
  ) => ({
    loadInitialState() {
      const savedState = persistence.loadMainState() as Partial<MarbleFinancesState> | null;
      const changelog = persistence.loadChangelog();
      if (savedState) {
        patchState(store, { ...savedState, changelog });
      } else {
        patchState(store, {
          months: DEMO_DATA.months,
          marbleMultiplier: DEMO_DATA.marbleMultiplier,
          customColors: DEMO_DATA.customColors,
          changelog
        });
      }
    },
    unloadData() {
      persistence.unloadData();
      patchState(store, {
        months: DEMO_DATA.months,
        marbleMultiplier: DEMO_DATA.marbleMultiplier,
        customColors: DEMO_DATA.customColors,
        changelog: []
      });
    },
    createFreshPortfolio() {
      persistence.unloadData();
      const freshMonth: MonthRecord = {
        id: 'mr_' + Date.now(),
        date: 'January ' + new Date().getFullYear(),
        grossAnnual: '0', netAnnual: '0', netMonthly: '0',
        flow: [], assetCategories: [], actionItems: []
      };
      patchState(store, {
        months: [freshMonth],
        marbleMultiplier: 1000,
        customColors: [],
        changelog: []
      });
    },
    exportData() {
      const state = {
        months: store.months(),
        marbleMultiplier: store.marbleMultiplier(),
        customColors: store.customColors()
      };
      persistence.exportData(state);
    },
    async importData(file: File) {
      const data = (await persistence.importData(file)) as ImportedPortfolio | null;
      if (data && data.months) {
        patchState(store, {
          months: data.months,
          marbleMultiplier: data.marbleMultiplier || 1000,
          customColors: data.customColors || [],
          changelog: []
        });
      }
    },
    recordChange(label: string, details?: string) {
      const entry: ChangelogEntry = {
        id: 'cl_' + Date.now() + Math.random().toString(36).substring(2, 9),
        label, details, timestamp: Date.now(),
        months: structuredClone(store.months()),
        multiplier: store.marbleMultiplier(),
        customColors: [...store.customColors()],
      };
      patchState(store, (s) => ({ changelog: [...s.changelog, entry].slice(-50) }));
    },
    undo() {
      const cl = store.changelog();
      if (cl.length < 2) return;
      const prev = cl[cl.length - 2];
      patchState(store, {
        months: structuredClone(prev.months),
        marbleMultiplier: prev.multiplier,
        customColors: [...prev.customColors],
        changelog: cl.slice(0, -1),
      });
    },
    confirmRevert() {
      const target = store.revertTarget();
      if (!target) return;
      const cl = store.changelog();
      const idx = cl.findIndex((h) => h.id === target.id);
      if (idx === -1) return;
      patchState(store, {
        months: structuredClone(target.months),
        marbleMultiplier: target.multiplier,
        customColors: [...target.customColors],
        changelog: cl.slice(0, idx + 1),
        isRevertModalOpen: false,
        revertTarget: null,
      });
    },
    setAutoApplyForward(val: boolean) { patchState(store, { autoApplyForward: val }); },
    cancelForwardUpdate() { patchState(store, { forwardTarget: null }); },
    resetToDemoData() {
      patchState(store, {
        months: DEMO_DATA.months,
        marbleMultiplier: DEMO_DATA.marbleMultiplier,
        customColors: DEMO_DATA.customColors,
        changelog: []
      });
    },
  })),
  // Block 2: Mutation Methods
  withMethods((store,
    mutation = inject(FinanceMutationService)
  ) => ({
    executeForwardAction(targetAction?: ForwardAction, cascade = false, record = true) {
      const action = targetAction || store.forwardTarget();
      if (!action) return;
      patchState(store, (state) => {
        const months = structuredClone(state.months);
        mutation.applyMutation(months, action.monthIdx, action);
        if (cascade) {
          for (let j = action.monthIdx + 1; j < months.length; j++) {
            mutation.applyMutation(months, j, action, true);
          }
        }
        return { months, forwardTarget: null };
      });
      if (record) {
        const monthDate = store.months()[action.monthIdx]?.date || '';
        const actionLabels: Record<string, string> = {
          flowAmount: 'Updated flow amount', flowLabel: 'Updated flow label',
          assetAmount: 'Updated asset balance', categoryLabel: 'Updated category name',
          assetLabel: 'Updated asset name', assetNote: 'Updated asset note',
          overview: 'Updated overview', addCategory: 'Added category',
          addAsset: 'Added asset', addFlow: 'Added cash flow',
          deleteCategory: 'Deleted category', deleteAsset: 'Deleted asset',
          deleteFlow: 'Deleted cash flow', toggleActionItem: 'Toggled Task',
        };
        const label = actionLabels[action.type] || 'Updated Portfolio';
        store.recordChange(label, `${label} in ${monthDate}`);
      }
    },
  })),
  // Block 3: Forwarding and Higher-level Methods (depends on Block 1 & 2)
  withMethods((store,
    mutation = inject(FinanceMutationService)
  ) => ({
    promptForwardUpdate(action: ForwardAction) {
      const isPrior = action.monthIdx < store.months().length - 1;
      if (isPrior && !store.autoApplyForward()) {
        action.staged = true;
        patchState(store, { forwardTarget: action });
      } else if (isPrior && store.autoApplyForward()) {
        store.executeForwardAction(action, true);
      } else {
        store.executeForwardAction(action, false, true);
      }
    },
    duplicateMonth(sourceIdx: number, customDate?: string) {
      patchState(store, (state) => ({
        months: mutation.duplicateMonth(state.months, sourceIdx, customDate)
      }));
      store.recordChange('Duplicated Month', `Created a copy of ${store.months()[sourceIdx].date}`);
    },
  })),
  // Block 4: Domain Events dependent on Block 3 Mutation Entry point
  withMethods((store) => ({
    toggleActionItem(monthIdx: number, id: string) {
      const item = store.months()[monthIdx].actionItems.find(i => i.id === id);
      if (!item) return;
      store.promptForwardUpdate({ type: 'toggleActionItem', monthIdx, idx: 0, targetId: id, value: !item.completed });
    },
    addNote(monthIdx: number, catIdx: number, assetIdx: number) {
      const asset = store.months()[monthIdx].assetCategories[catIdx].assets[assetIdx];
      const newNote = prompt('Enter note:', asset.note || '') || '';
      store.promptForwardUpdate({
        type: 'assetNote',
        monthIdx,
        idx: catIdx,
        subIdx: assetIdx,
        targetId: asset.id,
        value: newNote,
      });
    },
  })),
  // Block 5: Action Item & Assets manipulation
  withMethods((store) => ({
    addActionItem(monthIdx: number) {
      patchState(store, (s) => {
        const months = structuredClone(s.months);
        months[monthIdx].actionItems.push({ id: 'todo_' + Date.now(), label: '', completed: false });
        return { months };
      });
      store.recordChange('Added Checklist Item');
    },
    updateActionItem(monthIdx: number, id: string, label: string) {
      patchState(store, (s) => {
        const months = structuredClone(s.months);
        const item = months[monthIdx].actionItems.find((i) => i.id === id);
        if (item) item.label = label;
        return { months };
      });
    },
    deleteActionItem(monthIdx: number, id: string) {
      patchState(store, (s) => {
        const months = structuredClone(s.months);
        months[monthIdx].actionItems = months[monthIdx].actionItems.filter((i) => i.id !== id);
        return { months };
      });
      store.recordChange('Deleted Checklist Item');
    },
    reorderAssets(monthIdx: number, fromIdx: number, toIdx: number) {
      patchState(store, (s) => {
        const months = structuredClone(s.months);
        const [moved] = months[monthIdx].assetCategories.splice(fromIdx, 1);
        months[monthIdx].assetCategories.splice(toIdx, 0, moved);
        return { months };
      });
      store.recordChange('Reordered Categories');
    },
    moveSubAsset(monthIdx: number, fromCatIdx: number, fromSubIdx: number, toCatIdx: number, toSubIdx: number) {
      patchState(store, (s) => {
        const months = structuredClone(s.months);
        const [moved] = months[monthIdx].assetCategories[fromCatIdx].assets.splice(fromSubIdx, 1);
        months[monthIdx].assetCategories[toCatIdx].assets.splice(toSubIdx, 0, moved);
        return { months };
      });
      store.recordChange('Moved Asset');
    },
  })),
  // Block 6: UI State & Modals
  withMethods((store) => ({
    setSettingsOpen(isOpen: boolean) { patchState(store, { isSettingsOpen: isOpen }); },
    setMarbleMultiplier(val: number) { patchState(store, { marbleMultiplier: val }); },
    setAssetsGridSize(val: number) { patchState(store, { assetsGridSize: val }); },
    setFlowGridSize(val: number) { patchState(store, { flowGridSize: val }); },
    toggleFlowPanel() { patchState(store, (s) => ({ isFlowPanelOpen: !s.isFlowPanelOpen })); },
    toggleCharts(isOpen?: boolean) {
      patchState(store, (s) => ({ isChartsModalOpen: isOpen !== undefined ? isOpen : !s.isChartsModalOpen }));
    },
    setActiveMenuId(activeMenuId: string | null) { patchState(store, { activeMenuId }); },
    toggleHistory() { patchState(store, (s) => ({ isHistoryOpen: !s.isHistoryOpen })); },
    toggleTimeline() { patchState(store, (s) => ({ isTimelineOpen: !s.isTimelineOpen })); },
    setActiveTimelineIndex(idx: number) { patchState(store, { activeTimelineIndex: idx }); },
    closeRevertModal() { patchState(store, { isRevertModalOpen: false, revertTarget: null }); },
    promptRevert(item: ChangelogEntry) {
      patchState(store, { revertTarget: item, isRevertModalOpen: true, isHistoryOpen: false });
    },
    setTempCustomColor(color: string) { patchState(store, { tempCustomColor: color }); },
    setAddModalMode(mode: 'palette' | 'custom') { patchState(store, { addModalMode: mode }); },
    setNewAssetColor(color: string) { patchState(store, { newAssetColor: color }); },
    confirmPaletteColor(color: string) { patchState(store, { newAssetColor: color }); },
    selectColorRef(color: string) { patchState(store, { newAssetColor: color, addModalMode: 'palette' as const }); },
    confirmCustomColor() {
      const color = store.tempCustomColor();
      patchState(store, (s) => ({ customColors: [...s.customColors, color], newAssetColor: color, addModalMode: 'palette' as const }));
    },
    openAddModal(monthIdx: number, type: 'asset' | 'flow-expense' | 'flow-savings' | 'breakdown' = 'asset', parentIdx: number | null = null) {
      patchState(store, { isAddModalOpen: true, addModalType: type, activeModalMonthIndex: monthIdx, addBreakdownParentIndex: parentIdx });
    },
    openAddFlowModal(monthIndex: number, type: 'expense' | 'savings') {
      const modalType = type === 'expense' ? 'flow-expense' : 'flow-savings';
      patchState(store, { isAddModalOpen: true, addModalType: modalType, activeModalMonthIndex: monthIndex });
    },
    openAddBreakdownModal(monthIndex: number, categoryIndex: number) {
      patchState(store, { isAddModalOpen: true, addModalType: 'breakdown', activeModalMonthIndex: monthIndex, addBreakdownParentIndex: categoryIndex });
    },
    closeAddModal() { patchState(store, { isAddModalOpen: false, addBreakdownParentIndex: null }); },
    openDeleteModal(monthIndex: number, type: 'asset' | 'flow', index: number, subIndex: number | null = null) {
      patchState(store, { isDeleteModalOpen: true, deleteTarget: { monthIndex, type, index, subIndex } });
    },
    promptDelete(monthIndex: number, type: 'asset' | 'flow', index: number, subIndex: number | null = null) {
      patchState(store, { isDeleteModalOpen: true, deleteTarget: { monthIndex, type, index, subIndex } });
    },
    closeDeleteModal() { patchState(store, { isDeleteModalOpen: false, deleteTarget: null }); },
  })),
  // Block 7: Confirmation & Comparison actions (Depends on Block 3 Mutation Entry point)
  withMethods((store) => ({
    confirmDelete() {
      const target = store.deleteTarget();
      if (!target) return;
      const type = target.type === 'asset' ? (target.subIndex === null ? 'deleteCategory' : 'deleteAsset') : 'deleteFlow';
      const month = store.months()[target.monthIndex];
      const targetId = target.type === 'asset'
        ? (target.subIndex === null ? month.assetCategories[target.index].id : month.assetCategories[target.index].assets[target.subIndex!].id)
        : month.flow[target.index].id;
      const parentId = target.subIndex !== null ? month.assetCategories[target.index].id : undefined;
      store.promptForwardUpdate({ type: type as ForwardAction['type'], monthIdx: target.monthIndex, idx: target.index, subIdx: target.subIndex as number, targetId, parentId, value: null });
      patchState(store, { isDeleteModalOpen: false, deleteTarget: null });
    },
    executeDelete() {
      this.confirmDelete();
    },
    confirmAddAsset(label: string, val: number) {
      const monthIdx = store.activeModalMonthIndex();
      const parentIdx = store.addBreakdownParentIndex();
      if (parentIdx === null) {
        const color = store.addModalMode() === 'custom' ? store.tempCustomColor() : store.newAssetColor();
        store.promptForwardUpdate({ type: 'addCategory', monthIdx, idx: 0, value: { label, color, assets: [] } });
      } else {
        const parentId = store.months()[monthIdx].assetCategories[parentIdx].id;
        store.promptForwardUpdate({ type: 'addAsset', monthIdx, idx: parentIdx, parentId, value: { label, val } });
      }
      store.closeAddModal();
    },
    confirmAddFlow(label: string, val: number, type: string, parentCategory: 'expense' | 'savings') {
      const monthIdx = store.activeModalMonthIndex();
      store.promptForwardUpdate({
        type: 'addFlow',
        monthIdx,
        idx: 0,
        value: { label, val, type, parentCategory, color: parentCategory === 'expense' ? 'orange' : 'blue' },
      });
      store.closeAddModal();
    },
    startComparison(baseMonthId: string, targetMonthId: string) {
      patchState(store, { compareState: { baseMonthId, targetMonthId }, isCompareModalOpen: false, isCompareRibbonVisible: false });
    },
    clearComparison() { patchState(store, { compareState: null, isCompareRibbonVisible: false }); },
    setCompareRibbonVisible(visible: boolean) { patchState(store, { isCompareRibbonVisible: visible }); },
    openCompareModal() { patchState(store, { isCompareModalOpen: true }); },
    closeCompareModal() { patchState(store, { isCompareModalOpen: false }); },
  })),
  withComputed((store, calculator = inject(FinanceCalculatorService)) => ({
    monthsByYear: computed(() => calculator.groupMonthsByYear(store.months())),
    monthStats: computed(() => calculator.calculateMonthStats(store.months())),
    chartData: computed(() => calculator.formatChartData(store.months())),
    changelogInverse: computed(() => [...store.changelog()].reverse()),
  })),
  withHooks((store, persistence = inject(FinancePersistenceService)) => ({
    onInit() {
      store.loadInitialState();
      effect(() => {
        const state = {
          months: persistence.sanitizeMonths(store.months()),
          marbleMultiplier: store.marbleMultiplier(),
          assetsGridSize: store.assetsGridSize(),
          flowGridSize: store.flowGridSize(),
          customColors: store.customColors(),
        };
        persistence.saveMainState(state);
      });
      effect(() => {
        persistence.saveChangelog(store.changelog());
      });
    }
  }))
);
