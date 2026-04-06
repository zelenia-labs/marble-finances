const fs = require('fs');
const path = 'database/test.json';

const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let previousLiquid = 0;

data.months.forEach((month, idx) => {
    // 1. Calculate Monthly Net Accrual (Simulated from netMonthly)
    const netM = parseFloat(month.netMonthly) || 0;
    
    // 2. Adjust Cash to show growth from savings (additive across months)
    month.assetCategories.forEach(category => {
        if (category.label === 'Cash') {
            const hysa = category.assets.find(a => a.label === 'Marcus HYSA');
            if (hysa) {
                // Add net savings + a small random interest jitter 
                hysa.val += (idx * netM) + (Math.random() * 0.1);
            }
        }
        
        // 3. Add simulated Market Growth to Investments/Retirement (0.1% - 0.5% per month)
        if (category.label === 'Investments' || category.label === 'Retirement') {
            category.assets.forEach(asset => {
                const growthRate = 1 + (idx * (0.002 + Math.random() * 0.003));
                asset.val = parseFloat((asset.val * growthRate).toFixed(2));
            });
        }
    });

    // Handle MTM calculation for next steps
    const currentTotal = month.assetCategories.reduce((sum, cat) => 
        sum + cat.assets.reduce((s, a) => s + a.val, 0), 0);
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));

// Also re-generate demo data
const json = fs.readFileSync(path, 'utf8');
const tsContent = `import { MonthRecord, MonthSnapshot } from '../store/finance.store';

export interface DemoData {
  months: MonthRecord[];
  marbleMultiplier: number;
  snapshots: Record<string, MonthSnapshot | null>;
  customColors: string[];
}

export const DEMO_DATA: DemoData = ${json};
`;
fs.writeFileSync('src/app/data/demo.data.ts', tsContent);

console.log('Successfully injected simulated growth and accrual into test.json');
