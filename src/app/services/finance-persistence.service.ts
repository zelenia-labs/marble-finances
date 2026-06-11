import { Injectable } from '@angular/core';
import { ChangelogEntry, MonthRecord, ImportedPortfolio } from '../store/finance.store';

@Injectable({
  providedIn: 'root',
})
export class FinancePersistenceService {
  private readonly STORAGE_KEY = 'marble_finance_multi_data';
  private readonly CHANGELOG_KEY = 'marble_changelog';

  saveMainState(state: unknown): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    }
  }

  saveChangelog(changelog: ChangelogEntry[]): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(this.CHANGELOG_KEY, JSON.stringify(changelog));
    }
  }

  isValidImportedPortfolio(data: unknown): data is ImportedPortfolio {
    if (!data || typeof data !== 'object') return false;
    const d = data as Partial<ImportedPortfolio>;
    if (!Array.isArray(d.months)) return false;

    for (const m of d.months) {
      if (!m || typeof m !== 'object') return false;
      if (typeof m.id !== 'string') return false;
      if (typeof m.date !== 'string') return false;
      if (typeof m.grossAnnual !== 'string') return false;
      if (typeof m.netAnnual !== 'string') return false;
      if (typeof m.netMonthly !== 'string') return false;

      // Validate flow items
      if (!Array.isArray(m.flow)) return false;
      for (const f of m.flow) {
        if (!f || typeof f !== 'object') return false;
        if (typeof f.id !== 'string') return false;
        if (typeof f.label !== 'string') return false;
        if (typeof f.val !== 'number' || isNaN(f.val)) return false;
        if (typeof f.color !== 'string') return false;
        if (typeof f.type !== 'string') return false;
        if (f.parentCategory !== 'expense' && f.parentCategory !== 'savings') return false;
      }

      // Validate asset categories
      if (!Array.isArray(m.assetCategories)) return false;
      for (const cat of m.assetCategories) {
        if (!cat || typeof cat !== 'object') return false;
        if (typeof cat.id !== 'string') return false;
        if (typeof cat.label !== 'string') return false;
        if (typeof cat.color !== 'string') return false;
        if (!Array.isArray(cat.assets)) return false;
        for (const a of cat.assets) {
          if (!a || typeof a !== 'object') return false;
          if (typeof a.id !== 'string') return false;
          if (typeof a.label !== 'string') return false;
          if (typeof a.val !== 'number' || isNaN(a.val)) return false;
          if (a.note !== undefined && a.note !== null && typeof a.note !== 'string') return false;
        }
      }

      // Validate action items
      if (!Array.isArray(m.actionItems)) return false;
      for (const item of m.actionItems) {
        if (!item || typeof item !== 'object') return false;
        if (typeof item.id !== 'string') return false;
        if (typeof item.label !== 'string') return false;
        if (typeof item.completed !== 'boolean') return false;
      }
    }

    if (d.marbleMultiplier !== undefined && (typeof d.marbleMultiplier !== 'number' || isNaN(d.marbleMultiplier))) {
      return false;
    }

    if (d.customColors !== undefined) {
      if (!Array.isArray(d.customColors)) return false;
      for (const c of d.customColors) {
        if (typeof c !== 'string') return false;
      }
    }

    return true;
  }

  loadMainState(): unknown | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const saved = window.localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (!this.isValidImportedPortfolio(parsed)) {
        console.warn('Saved local state fails validation check. Ignoring state.');
        return null;
      }
      if (parsed.months) {
        parsed.months = parsed.months.map((m: MonthRecord) => ({
          ...m,
          assetCategories: m.assetCategories.filter(
            (cat) => cat.assets.reduce((sum, a) => sum + a.val, 0) > 0,
          ),
        }));
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse saved state', e);
      return null;
    }
  }

  loadChangelog(): ChangelogEntry[] {
    if (typeof window === 'undefined' || !window.sessionStorage) return [];
    const saved = window.sessionStorage.getItem(this.CHANGELOG_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse changelog', e);
      return [];
    }
  }

  sanitizeMonths(months: MonthRecord[]): MonthRecord[] {
    return months.map((month) => ({
      ...month,
      actionItems: month.actionItems.filter((item) => item.label.trim() !== ''),
      assetCategories: month.assetCategories.map((cat) => ({
        ...cat,
        assets: cat.assets.map(({ note, ...rest }) =>
          note != null && note !== '' ? { ...rest, note } : rest,
        ),
      })),
    }));
  }

  unloadData(): void {
    if (typeof window !== 'undefined') {
      if (window.localStorage) window.localStorage.removeItem(this.STORAGE_KEY);
      if (window.sessionStorage) window.sessionStorage.removeItem(this.CHANGELOG_KEY);
    }
  }

  exportData(data: unknown): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marble-finances-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importData(file: File): Promise<unknown> {
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (!this.isValidImportedPortfolio(parsed)) {
        console.warn('Imported file fails validation check.');
        if (typeof window !== 'undefined' && window.alert) {
          window.alert('Failed to import file: Invalid portfolio data schema.');
        }
        return null;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse import file', e);
      return null;
    }
  }
}
