const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/test.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.months.forEach(month => {
  month.assetCategories.forEach(cat => {
    cat.assets.forEach(asset => {
      if (asset.label === 'Marcus HYSA') {
        asset.note = '3.65% APY';
      } else if (asset.label === 'Fidelity 401k') {
        asset.note = 'Contributing 6% 401k Roth + 3% employer match';
      } else if (asset.label === 'Subaru Outback (Equity)') {
        asset.note = 'Subaru Guaranteed Value';
      }
    });
  });
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully updated asset notes in test.json');
