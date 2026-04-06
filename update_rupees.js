import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db.json');
const dbRaw = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(dbRaw);

// Multiply by 83 to simulate INR conversion from USD
const rate = 83;

// Update transactions
db.transactions = db.transactions.map(t => ({
  ...t,
  amount: t.amount * rate
}));

// Update vault assets
db.vaultAssets = db.vaultAssets.map(v => ({
  ...v,
  value: v.value * rate
}));

// Update portfolio summary
db.portfolioSummary.totalBalance = db.portfolioSummary.totalBalance * rate;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully updated db.json with INR values');
