const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/test.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// We work backwards from the last month (index length - 1) to the first
// The last month is our "Ideal State" source of truth.
const months = db.months;

for (let i = months.length - 1; i > 0; i--) {
  const currentMonth = months[i];
  const prevMonth = months[i - 1];

  // Random growth rate for this month (from prev to current)
  // User wants -1% to +4%
  const rate = (Math.random() * 5 - 1) / 100; // -0.01 to +0.04

  // Process Asset Categories
  currentMonth.assetCategories.forEach((cat, catIdx) => {
    const prevCat = prevMonth.assetCategories[catIdx];
    
    cat.assets.forEach((asset, assetIdx) => {
      const prevAsset = prevCat.assets[assetIdx];
      
      if (cat.label === 'Cash') {
        // Cash reconstructs by subtracting the savings flow of the PREVIOUS month
        // (Since savings from Jan flow into Feb)
        // Wait, the UI logic expects that Month M's cash = Month M-1's cash + Month M-1's netMonthly
        // So Month M-1.cash = Month M.cash - Month M-1.netMonthly
        // We divide the netMonthly proportionaly among cash accounts, or just the primary one (Marcus)
        if (asset.label === 'Marcus HYSA') {
          const savingsAmount = parseFloat(prevMonth.netMonthly) || 0;
          prevAsset.val = asset.val - savingsAmount;
        } else {
          // Other cash accounts stays static in demo for simplicity
          prevAsset.val = asset.val;
        }
      } else if (cat.label === 'Investments' || cat.label === 'Retirement') {
        // Market growth reconstruction
        // current = prev * (1 + rate)  => prev = current / (1 + rate)
        prevAsset.val = asset.val / (1 + rate);
      } else if (cat.label === 'Tangible' && asset.label.includes('Residence')) {
        // Real estate grows slower: 0% to 0.5%
        const reRate = (Math.random() * 0.5) / 100;
        prevAsset.val = asset.val / (1 + reRate);
      } else {
        // Other assets (Cars, etc.) don't grow or shrink in this logic
        prevAsset.val = asset.val;
      }
    });
  });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully reconstructed historical months working backwards from ideal state.');
console.log('Logic applied: Market growth (-1% to +4%) on Inv/Ret, and Savings Accrual on Cash.');
