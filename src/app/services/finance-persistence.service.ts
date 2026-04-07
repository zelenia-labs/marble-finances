import { Injectable } from '@angular/core';
import { ChangelogEntry, MonthRecord } from '../store/finance.store';

@Injectable({
  providedIn: 'root',
})
export class FinancePersistenceService {
  private readonly STORAGE_KEY = 'marble_finance_multi_data';
  private readonly CHANGELOG_KEY = 'marble_changelog';

  saveMainState(state: unknown): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    }
  }

  saveChangelog(changelog: ChangelogEntry[]): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(this.CHANGELOG_KEY, JSON.stringify(changelog));
    }
  }

  loadMainState(): unknown | null {
    if (typeof window === 'undefined') return null;
    const saved = window.localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
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
    if (typeof window === 'undefined') return [];
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
      window.localStorage.removeItem(this.STORAGE_KEY);
      window.sessionStorage.removeItem(this.CHANGELOG_KEY);
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
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse import file', e);
      return null;
    }
  }
}
