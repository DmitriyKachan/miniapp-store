import { Router, Request, Response } from 'express';
import { db, Category } from '../db.js';

const router = Router();

// GET all categories
router.get('/', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
    const categories = stmt.all() as unknown as Category[];
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create category
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, icon = 'Package', sort_order = 0 } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Название категории обязательно' });
    }

    const stmt = db.prepare('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)');
    const result = stmt.run(name.trim(), icon, Number(sort_order) || 0);

    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid) as unknown as Category;
    res.status(201).json({ success: true, data: newCategory });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update category
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, icon, sort_order } = req.body;

    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as unknown as Category | undefined;
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Категория не найдена' });
    }

    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedIcon = icon !== undefined ? icon : existing.icon;
    const updatedSort = sort_order !== undefined ? Number(sort_order) : existing.sort_order;

    const stmt = db.prepare('UPDATE categories SET name = ?, icon = ?, sort_order = ? WHERE id = ?');
    stmt.run(updatedName, updatedIcon, updatedSort, id);

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as unknown as Category;
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE category
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Категория не найдена' });
    }

    // Delete associated products or cascade
    db.prepare('DELETE FROM products WHERE category_id = ?').run(id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.json({ success: true, message: 'Категория и привязанные товары удалены' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
