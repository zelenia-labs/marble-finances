const fs = require('fs');
const json = fs.readFileSync('database/test.json', 'utf8');
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
console.log('Successfully generated demo.data.ts from test.json');
