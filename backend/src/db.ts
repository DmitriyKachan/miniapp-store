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
  icon: string;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  title: string;
  description: string;
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
      icon TEXT DEFAULT 'Package',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
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

  // Seed sample categories and products if empty
  const countCategoriesStmt = db.prepare('SELECT COUNT(*) as count FROM categories');
  const catCount = (countCategoriesStmt.get() as { count: number }).count;

  if (catCount === 0) {
    console.log('🌱 Seeding initial database categories and products...');

    const insertCat = db.prepare('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)');
    const insertProd = db.prepare('INSERT INTO products (category_id, title, description, price, image_url, in_stock) VALUES (?, ?, ?, ?, ?, ?)');

    // 1. Coffee & Drinks
    const cat1 = insertCat.run('Кофе и Напитки', 'Coffee', 1).lastInsertRowid as number;
    insertProd.run(
      cat1,
      'Капучино Grand Cru',
      'Бархатистый эспрессо со взбитым фермерским молоком и нотками лесного ореха. 350 мл.',
      320,
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
      1
    );
    insertProd.run(
      cat1,
      'Флэт Уайт',
      'Двойной шот спешелти эспрессо с тонким слоем нежной микропены. 200 мл.',
      350,
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80',
      1
    );
    insertProd.run(
      cat1,
      'Матча Латте на кокосовом',
      'Церемониальный японский чай матча с кремовым кокосовым молоком. 300 мл.',
      380,
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
      1
    );

    // 2. Bakery & Desserts
    const cat2 = insertCat.run('Выпечка и Десерты', 'Cake', 2).lastInsertRowid as number;
    insertProd.run(
      cat2,
      'Круассан с миндальным кремом',
      'Хрустящее слоеное тесто на натуральном сливочном масле с миндальной начинкой и лепестками.',
      290,
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      1
    );
    insertProd.run(
      cat2,
      'Чизкейк Сан-Себастьян',
      'Знаменитый баскский жженый чизкейк с нежнейшей сливочной серединкой.',
      420,
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
      1
    );

    // 3. Merch & Accessories
    const cat3 = insertCat.run('Мерч и Аксессуары', 'Shirt', 3).lastInsertRowid as number;
    insertProd.run(
      cat3,
      'Худи «Minimalist» Black',
      'Премиальный плотный 100% органический хлопок 460г/м². Оверсайз крой с минималистичной вышивкой.',
      4900,
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
      1
    );
    insertProd.run(
      cat3,
      'Термокружка Tumbler 500ml',
      'Двойные вакуумные стенки из нержавеющей стали. Сохраняет напиток горячим до 8 часов.',
      1800,
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      1
    );

    // 4. Gadgets
    const cat4 = insertCat.run('Гаджеты и Звук', 'Headphones', 4).lastInsertRowid as number;
    insertProd.run(
      cat4,
      'Беспроводные наушники Studio Air',
      'Активное шумоподавление ANC, прозрачный режим, до 30 часов автономной работы.',
      8900,
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      1
    );

    console.log('✅ Seeding complete.');
  }
}
