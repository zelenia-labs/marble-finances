const fs = require('fs');
const path = 'database/test.json';

const data = JSON.parse(fs.readFileSync(path, 'utf8'));

data.months.forEach(month => {
    month.assetCategories.forEach(category => {
        if (category.label === 'Investments') {
            // Replace assets with new list
            category.assets = [
                { id: 'asset_fidelity_' + month.id, label: 'Fidelity Account', val: 45.0 },
                { id: 'asset_schwab_' + month.id, label: 'Charles Schwab Account', val: 34.0 }
            ];
        }
    });
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

console.log('Successfully updated investments and re-generated demo data');
