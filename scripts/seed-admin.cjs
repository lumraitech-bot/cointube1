const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(process.cwd(), 'data', 'db.json');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], sessions: [], videos: [], likes: [] }, null, 2), 'utf-8');
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const hasAdmin = (db.users || []).some(u => u.role === 'ADMIN');
if (hasAdmin) {
  console.log('Admin already exists. Nothing to do.');
  process.exit(0);
}

const email = process.env.ADMIN_EMAIL || 'admin@cointube.local';
const password = process.env.ADMIN_PASSWORD || 'admin12345';
const name = process.env.ADMIN_NAME || 'Admin';

const passwordHash = bcrypt.hashSync(password, 10);
const id = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 32);
const now = new Date().toISOString();

db.users = db.users || [];
db.users.push({ id, name, email, passwordHash, role: 'ADMIN', createdAt: now });
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

console.log('Admin created:');
console.log('  Email   :', email);
console.log('  Password:', password);
