import { Router, Request, Response } from 'express';
import { db, Order } from '../db.js';
import { notifyNewOrder } from '../bot.js';

const router = Router();

// GET all orders (for admin)
router.get('/', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY id DESC');
    const orders = stmt.all() as unknown as Order[];

    // Parse items_json
    const parsedOrders = orders.map((order) => {
      let items = [];
      try {
        items = JSON.parse(order.items_json);
      } catch (e) {
        items = [];
      }
      return { ...order, items };
    });

    res.json({ success: true, data: parsedOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET order by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = stmt.get(id) as unknown as Order | undefined;

    if (!order) {
      return res.status(404).json({ success: false, error: 'Заказ не найден' });
    }

    let items = [];
    try {
      items = JSON.parse(order.items_json);
    } catch (e) {
      items = [];
    }

    res.json({ success: true, data: { ...order, items } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create order
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      telegram_user_id = '',
      customer_name = '',
      customer_username = '',
      phone = '',
      comment = '',
      items = [],
      total_price,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Корзина пуста' });
    }

    let calculatedTotal = 0;
    for (const item of items) {
      const prod = db.prepare('SELECT id, price, title FROM products WHERE id = ?').get(item.id) as any;
      if (prod) {
        calculatedTotal += prod.price * (item.quantity || 1);
      }
    }

    const finalTotal = total_price !== undefined ? Number(total_price) : calculatedTotal;

    const stmt = db.prepare(`
      INSERT INTO orders (telegram_user_id, customer_name, customer_username, phone, comment, total_price, status, items_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      String(telegram_user_id),
      String(customer_name),
      String(customer_username),
      String(phone),
      String(comment),
      finalTotal,
      'pending',
      JSON.stringify(items)
    );

    const newOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid) as unknown as Order;

    // Send Telegram notification if bot is configured
    notifyNewOrder(newOrder, items).catch((err) => {
      console.warn('Telegram notification failed:', err);
    });

    res.status(201).json({
      success: true,
      data: {
        ...newOrder,
        items,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH update order status
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const allowed = ['pending', 'paid', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Недопустимый статус' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as unknown as Order;

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
