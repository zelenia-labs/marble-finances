const fs = require('fs');
const path = 'database/test.json';

const data = JSON.parse(fs.readFileSync(path, 'utf8'));

data.months.forEach(month => {
    // Collect the assets from all categories
    month.assetCategories.forEach(category => {
        if (category.label === 'Tangible') {
            // Update Home Equity
            const homeEquity = category.assets.find(a => a.label === 'Primary Residence (Equity)');
            if (homeEquity) {
                homeEquity.val = 80.0;
            }
            
            // Remove Fine Art
            category.assets = category.assets.filter(a => a.label !== 'Fine Art Collection');
        }
    });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Successfully updated assets in test.json');
