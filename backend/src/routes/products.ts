import { Router, Request, Response } from 'express';
import { db, Product } from '../db.js';
import { publishProductToChannel } from '../bot.js';

const router = Router();

// GET all products with optional category filter and search
router.get('/', (req: Request, res: Response) => {
  try {
    const { category_id, search, in_stock_only } = req.query;

    let query = 'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params: (string | number)[] = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(Number(category_id));
    }

    if (in_stock_only === 'true') {
      query += ' AND p.in_stock = 1';
    }

    if (search && typeof search === 'string' && search.trim()) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    query += ' ORDER BY p.id DESC';

    const stmt = db.prepare(query);
    const products = stmt.all(...params) as unknown as (Product & { category_name: string })[];
    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET product by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const stmt = db.prepare('SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?');
    const product = stmt.get(id) as unknown as (Product & { category_name: string }) | undefined;

    if (!product) {
      return res.status(404).json({ success: false, error: 'Товар не найден' });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST publish product to Telegram Channel
router.post('/publish-to-channel', async (req: Request, res: Response) => {
  try {
    const { product, channel } = req.body;
    if (!product || !channel) {
      return res.status(400).json({ success: false, error: 'Product and channel are required' });
    }

    await publishProductToChannel(product, channel);
    res.json({ success: true, message: 'Опубликовано успешно в Telegram!' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Ошибка отправки в Telegram' });
  }
});

// POST create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      category_id,
      title,
      description = '',
      price,
      image_url = '',
      in_stock = 1,
      publish_to_channel,
      channel_username,
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Название товара обязательно' });
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ success: false, error: 'Укажите корректную цену товара' });
    }

    if (!category_id) {
      return res.status(400).json({ success: false, error: 'Категория обязательна' });
    }

    // Verify category exists
    const cat = db.prepare('SELECT id FROM categories WHERE id = ?').get(Number(category_id));
    if (!cat) {
      return res.status(400).json({ success: false, error: 'Указанная категория не существует' });
    }

    const stmt = db.prepare(`
      INSERT INTO products (category_id, title, description, price, image_url, in_stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      Number(category_id),
      title.trim(),
      description.trim(),
      Number(price),
      image_url.trim(),
      Number(in_stock) ? 1 : 0
    );

    const newProduct = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid) as unknown as Product & { category_name: string };

    if (publish_to_channel && channel_username) {
      try {
        await publishProductToChannel(newProduct, channel_username);
      } catch (err: any) {
        console.warn('Auto publish on creation error:', err.message);
      }
    }

    res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update product
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { category_id, title, description, price, image_url, in_stock } = req.body;

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as unknown as Product | undefined;
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Товар не найден' });
    }

    const updatedCategory = category_id !== undefined ? Number(category_id) : existing.category_id;
    const updatedTitle = title !== undefined ? String(title).trim() : existing.title;
    const updatedDesc = description !== undefined ? String(description).trim() : existing.description;
    const updatedPrice = price !== undefined ? Number(price) : existing.price;
    const updatedImage = image_url !== undefined ? String(image_url).trim() : existing.image_url;
    const updatedStock = in_stock !== undefined ? (Number(in_stock) ? 1 : 0) : existing.in_stock;

    const stmt = db.prepare(`
      UPDATE products
      SET category_id = ?, title = ?, description = ?, price = ?, image_url = ?, in_stock = ?
      WHERE id = ?
    `);

    stmt.run(updatedCategory, updatedTitle, updatedDesc, updatedPrice, updatedImage, updatedStock, id);

    const updated = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(id) as unknown as Product & { category_name: string };

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH toggle in_stock status
router.patch('/:id/stock', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as unknown as Product | undefined;
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Товар не найден' });
    }

    const newStock = existing.in_stock === 1 ? 0 : 1;
    db.prepare('UPDATE products SET in_stock = ? WHERE id = ?').run(newStock, id);

    res.json({ success: true, data: { id, in_stock: newStock } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE product
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Товар не найден' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true, message: 'Товар успешно удален' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
