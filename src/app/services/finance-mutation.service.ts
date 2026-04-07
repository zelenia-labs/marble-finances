import { Injectable } from '@angular/core';
import { Asset, AssetCategory, CashFlowItem, ForwardAction, MonthRecord } from '../store/finance.store';

@Injectable({
  providedIn: 'root',
})
export class FinanceMutationService {
  applyMutation(months: MonthRecord[], idx: number, action: ForwardAction, isCascade = false): void {
    if (action.type === 'flowAmount') {
      const item = isCascade
        ? months[idx].flow.find((f) => f.id === action.targetId)
        : months[idx].flow[action.idx];
      if (item)
        item.val =
          typeof action.value === 'string' ? parseFloat(action.value) : (action.value as number);
    } else if (action.type === 'flowLabel') {
      const item = isCascade
        ? months[idx].flow.find((f) => f.id === action.targetId)
        : months[idx].flow[action.idx];
      if (item) item.label = action.value as string;
    } else if (action.type === 'assetAmount') {
      const asset = isCascade
        ? months[idx].assetCategories.find((a) => a.id === action.parentId)
        : months[idx].assetCategories[action.idx];
      if (asset) {
        const sub = isCascade
          ? asset.assets.find((s) => s.id === action.targetId)
          : asset.assets[action.subIdx!];
        if (sub)
          sub.val =
            typeof action.value === 'string'
              ? parseFloat(action.value)
              : (action.value as number);
      }
    } else if (action.type === 'categoryLabel') {
      const asset = isCascade
        ? months[idx].assetCategories.find((a) => a.id === action.targetId)
        : months[idx].assetCategories[action.idx];
      if (asset) asset.label = action.value as string;
    } else if (action.type === 'assetLabel') {
      const asset = isCascade
        ? months[idx].assetCategories.find((a) => a.id === action.parentId)
        : months[idx].assetCategories[action.idx];
      if (asset) {
        const sub = isCascade
          ? asset.assets.find((s) => s.id === action.targetId)
          : asset.assets[action.subIdx!];
        if (sub) sub.label = action.value as string;
      }
    } else if (action.type === 'assetNote') {
      const asset = isCascade
        ? months[idx].assetCategories.find((a) => a.id === action.parentId)
        : months[idx].assetCategories[action.idx];
      if (asset) {
        const sub = isCascade
          ? asset.assets.find((s) => s.id === action.targetId)
          : asset.assets[action.subIdx!];
        if (sub) sub.note = action.value as string | null | undefined;
      }
    } else if (action.type === 'addCategory') {
      if (isCascade) {
        months[idx].assetCategories.unshift(structuredClone(action.value as AssetCategory));
      } else {
        months[idx].assetCategories.splice(action.idx, 0, action.value as AssetCategory);
      }
    } else if (action.type === 'addAsset') {
      const asset = isCascade
        ? months[idx].assetCategories.find((a) => a.id === action.parentId)
        : months[idx].assetCategories[action.idx];
      if (asset) asset.assets.push(structuredClone(action.value as Asset));
    } else if (action.type === 'addFlow') {
      if (isCascade) {
        months[idx].flow.push(structuredClone(action.value as CashFlowItem));
      } else {
        months[idx].flow.splice(action.idx, 0, action.value as CashFlowItem);
      }
    } else if (action.type === 'deleteCategory') {
      months[idx].assetCategories = months[idx].assetCategories.filter(
        (a) => a.id !== action.targetId,
      );
    } else if (action.type === 'deleteAsset') {
      const asset = isCascade
        ? months[idx].assetCategories.find((a) => a.id === action.parentId)
        : months[idx].assetCategories[action.idx];
      if (asset) asset.assets = asset.assets.filter((s) => s.id !== action.targetId);
    } else if (action.type === 'deleteFlow') {
      months[idx].flow = months[idx].flow.filter((f) => f.id !== action.targetId);
    } else if (action.type === 'overview') {
      months[idx][action.field!] = action.value as string;
    } else if (action.type === 'toggleActionItem') {
      const item = months[idx].actionItems.find((i) => i.id === action.targetId);
      if (item) item.completed = action.value as boolean;
    }
  }

  duplicateMonth(months: MonthRecord[], sourceIdx: number, customDate?: string): MonthRecord[] {
    const sourceMonth = months[sourceIdx];
    let nextDateStr = customDate;
    let nextId: string;
    
    if (!nextDateStr) {
      const lastMonth = months[months.length - 1];
      const dateParts = lastMonth.date.trim().split(' ');
      const mStr = dateParts[0];
      let yNum = parseInt(dateParts[1]);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      let mIdx = monthNames.findIndex((m) => m.toLowerCase().startsWith(mStr.toLowerCase()));
      if (mIdx === -1) mIdx = 0;
      if (mIdx === 11) { mIdx = 0; yNum++; } else { mIdx++; }
      nextDateStr = `${monthNames[mIdx]} ${yNum}`;
      nextId = `${monthNames[mIdx]}_${yNum}_${Date.now()}`;
    } else {
      nextId = `${nextDateStr.replace(' ', '_')}_${Date.now()}`;
    }

    const incompleteActions = sourceMonth.actionItems
      .filter((i) => !i.completed)
      .map((i) => ({ ...i }));

    const newMonth: MonthRecord = {
      id: nextId,
      date: nextDateStr,
      grossAnnual: sourceMonth.grossAnnual,
      netAnnual: sourceMonth.netAnnual,
      netMonthly: sourceMonth.netMonthly,
      actionItems: incompleteActions,
      flow: structuredClone(sourceMonth.flow),
      assetCategories: structuredClone(sourceMonth.assetCategories),
    };

    return [...months, newMonth].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
