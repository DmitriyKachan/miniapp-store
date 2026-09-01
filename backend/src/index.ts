import express from 'express';
import cors from 'cors';
import path from 'node:path';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';
import categoriesRouter from './routes/categories.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import uploadRouter from './routes/upload.js';
import './bot.js';

dotenv.config();

// Initialize DB schema and seed data
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder
const uploadsDir = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/upload', uploadRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    adminIds: (process.env.ADMIN_IDS || '').split(',').map((id) => id.trim()).filter(Boolean),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running on http://localhost:${PORT}`);
});
