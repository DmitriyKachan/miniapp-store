import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'shop.sqlite');
export const db = new DatabaseSync(dbPath);

export interface Category {
  id: number;
  name: string;
  name_ru?: string;
  name_pl?: string;
  name_ua?: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  title: string;
  title_ru?: string;
  title_pl?: string;
  title_ua?: string;
  description: string;
  description_ru?: string;
  description_pl?: string;
  description_ua?: string;
  price: number;
  image_url: string;
  in_stock: number; // 1 = in stock, 0 = out of stock
  created_at: string;
}

export interface Order {
  id: number;
  telegram_user_id: string;
  customer_name: string;
  customer_username: string;
  phone: string;
  comment: string;
  total_price: number;
  status: string; // 'pending', 'paid', 'completed', 'cancelled'
  items_json: string;
  created_at: string;
}

export function initDatabase() {
  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_ru TEXT DEFAULT '',
      name_pl TEXT DEFAULT '',
      name_ua TEXT DEFAULT '',
      icon TEXT DEFAULT 'Package',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      title_ru TEXT DEFAULT '',
      title_pl TEXT DEFAULT '',
      title_ua TEXT DEFAULT '',
      description TEXT DEFAULT '',
      description_ru TEXT DEFAULT '',
      description_pl TEXT DEFAULT '',
      description_ua TEXT DEFAULT '',
      price REAL NOT NULL,
      image_url TEXT DEFAULT '',
      in_stock INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_user_id TEXT DEFAULT '',
      customer_name TEXT DEFAULT '',
      customer_username TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      comment TEXT DEFAULT '',
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      items_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Auto-migrate new columns if table already existed
  try { db.exec("ALTER TABLE categories ADD COLUMN name_ru TEXT DEFAULT '';"); } catch {}
  try { db.exec("ALTER TABLE categories ADD COLUMN name_pl TEXT DEFAULT '';"); } catch {}
  try { db.exec("ALTER TABLE categories ADD COLUMN name_ua TEXT DEFAULT '';"); } catch {}
  try { db.exec("ALTER TABLE products ADD COLUMN title_ru TEXT DEFAULT '';"); } catch {}
  try { db.exec("ALTER TABLE products ADD COLUMN title_pl TEXT DEFAULT '';"); } catch {}
  try { db.exec("ALTER TABLE products ADD COLUMN title_ua TEXT DEFAULT '';"); } catch {}
  try { db.exec("ALTER TABLE products ADD COLUMN description_ru TEXT DEFAULT '';"); } catch {}
  try { db.exec("ALTER TABLE products ADD COLUMN description_pl TEXT DEFAULT '';"); } catch {}
  try { db.exec("ALTER TABLE products ADD COLUMN description_ua TEXT DEFAULT '';"); } catch {}
}
