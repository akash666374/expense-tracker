
const fs = require('fs');

const filePath = './db.json';
const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

db.expenses.forEach((expense, index) => {
    expense.id = index + 1;
});

fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

console.log('Expense IDs converted to numbers.');


