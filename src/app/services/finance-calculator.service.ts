import { Injectable } from '@angular/core';
import { AssetCategory, MonthRecord } from '../store/finance.store';
import { TAILWIND_COLOR_MAP } from '../utils/color.util';

export interface MonthStats {
  mtm: number;
  ytd: number;
  currentTotal: number;
  cashPercent: number;
  investmentsPercent: number;
  liquidNetWorth: number;
}

export interface YearGroup {
  year: string;
  ytd: number;
  items: { month: MonthRecord; index: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class FinanceCalculatorService {
  sumAssets(assetCategories: AssetCategory[]): number {
    return assetCategories.reduce((total, a) => total + a.assets.reduce((s, sa) => s + sa.val, 0), 0);
  }

  groupMonthsByYear(months: MonthRecord[]): YearGroup[] {
    const groups: YearGroup[] = [];

    months.forEach((m, index) => {
      const year = m.date.split(' ').pop() || 'Unknown';
      let group = groups.find((g) => g.year === year);
      if (!group) {
        group = { year, ytd: 0, items: [] };
        groups.push(group);
      }
      group.items.push({ month: m, index });
    });

    groups.forEach((g) => {
      if (g.items.length > 0) {
        const startVal = this.sumAssets(g.items[0].month.assetCategories);
        const endVal = this.sumAssets(g.items[g.items.length - 1].month.assetCategories);
        g.ytd = startVal === 0 ? 0 : ((endVal - startVal) / startVal) * 100;
      }
    });

    return groups;
  }

  calculateMonthStats(months: MonthRecord[]): Map<string, MonthStats> {
    const stats = new Map<string, MonthStats>();

    months.forEach((m, idx) => {
      const currentTotal = this.sumAssets(m.assetCategories);
      let mtm = 0;
      let ytd = 0;

      if (idx > 0) {
        const prevTotal = this.sumAssets(months[idx - 1].assetCategories);
        mtm = prevTotal === 0 ? 0 : ((currentTotal - prevTotal) / prevTotal) * 100;
      }

      const year = m.date.split(' ').pop();
      const earliestThisYear = months.find((month) => month.date.endsWith(year!));
      if (earliestThisYear) {
        const firstTotal = this.sumAssets(earliestThisYear.assetCategories);
        ytd = firstTotal === 0 ? 0 : ((currentTotal - firstTotal) / firstTotal) * 100;
      }

      const cashTotal = m.assetCategories
        .filter((a) => a.label.toLowerCase().trim() === 'cash')
        .reduce((t, a) => t + a.assets.reduce((s, sa) => s + sa.val, 0), 0);

      const investmentsTotal = m.assetCategories
        .filter((a) => {
          const l = a.label.toLowerCase().trim();
          return l === 'investments' || l === 'retirement' || l === 'crypto' || l === 'stocks';
        })
        .reduce((t, a) => t + a.assets.reduce((s, sa) => s + sa.val, 0), 0);

      const sparklineDisplayTotal = cashTotal + investmentsTotal;
      const cashPercent =
        sparklineDisplayTotal === 0 ? 0 : (cashTotal / sparklineDisplayTotal) * 100;
      const investmentsPercent =
        sparklineDisplayTotal === 0 ? 0 : (investmentsTotal / sparklineDisplayTotal) * 100;

      stats.set(m.id, {
        mtm,
        ytd,
        currentTotal,
        cashPercent,
        investmentsPercent,
        liquidNetWorth: sparklineDisplayTotal,
      });
    });

    return stats;
  }

  formatChartData(months: MonthRecord[]) {
    const labels = months.map((m) => m.date);

    const categoryMap = new Map<string, { label: string; color: string }>();
    months.forEach((m) => {
      m.assetCategories.forEach((c) => {
        const key = c.label.toLowerCase().trim();
        if (!categoryMap.has(key)) {
          let hexColor = c.color;
          if (c.color.startsWith('bg-')) {
            hexColor = (TAILWIND_COLOR_MAP as Record<string, string>)[c.color] || '#A0AAB2';
          }
          categoryMap.set(key, { label: c.label, color: hexColor });
        }
      });
    });

    const compositionDatasets = Array.from(categoryMap.entries()).map(([key, info], i) => {
      const data = months.map((m) => {
        const cat = m.assetCategories.find((c) => c.label.toLowerCase().trim() === key);
        return cat ? cat.assets.reduce((sum, a) => sum + a.val, 0) : 0;
      });
      return {
        label: info.label,
        data,
        fill: i === 0 ? 'origin' : '-1', // Explicitly fill to previous dataset
        backgroundColor: info.color,
        borderColor: info.color,
        tension: 0.4,
      };
    });

    const totalValueData = months.map((m) => this.sumAssets(m.assetCategories));
    const totalValueDataset = [
      {
        label: 'Total Value',
        data: totalValueData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.1,
        fill: 'origin',
      },
    ];

    return { labels, compositionDatasets, totalValueData, totalValueDataset };
  }
}
