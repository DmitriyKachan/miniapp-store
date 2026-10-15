import { Bot, InlineKeyboard } from 'grammy';
import dotenv from 'dotenv';
import { Order, Product } from './db.js';

dotenv.config();

const token = process.env.BOT_TOKEN || '';
const webAppUrl = process.env.WEBAPP_URL || 'https://dmitriykachan.github.io/miniapp-store/';
const adminChatId = process.env.ADMIN_CHAT_ID || '';

export let bot: Bot | null = null;

if (token) {
  try {
    bot = new Bot(token);

    bot.command('start', async (ctx) => {
      const liveUrl = `${webAppUrl}?v=${Date.now()}`;
      const keyboard = new InlineKeyboard()
        .webApp('🌸 Відкрити вітрину Flowers Lviv', liveUrl)
        .row()
        .url('📸 Instagram @flowers___lviv', 'https://www.instagram.com/flowers___lviv/');
      
      await ctx.reply(
        `🌸 **Вітаємо у студії квітів Flowers Lviv!**\n\n` +
        `Свіжі квіти щодня, розкішні авторські букети, троянди та композиції з швидкою доставкою по Львову від 60 хв.\n\n` +
        `📍 **Салон / Самовивіз:** м. Львів, вул. Топольна, 4В\n` +
        `⏰ **Графік роботи:** Щодня з 10:00 до 20:00\n` +
        `📸 **Instagram:** [@flowers___lviv](https://www.instagram.com/flowers___lviv/)\n\n` +
        `👇 Натисніть кнопку нижче, щоб переглянути букети та оформити замовлення:`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      );
    });

    bot.start({
      onStart: (info) => {
        console.log(`🤖 Telegram Bot @${info.username} started successfully for Flowers Lviv!`);
      },
    }).catch((err) => {
      console.warn('⚠️ Telegram Bot polling error (check BOT_TOKEN):', err.message);
    });
  } catch (err: any) {
    console.warn('⚠️ Failed to initialize Telegram Bot:', err.message);
    bot = null;
  }
} else {
  console.log('ℹ️ BOT_TOKEN is not provided. Telegram bot polling disabled. WebApp API is fully active.');
}

export async function publishProductToChannel(product: Product, channelIdOrUsername: string | number) {
  if (!bot) {
    throw new Error('Telegram Bot is not initialized');
  }

  const raw = String(channelIdOrUsername).trim();
  let chatId: string | number = raw;
  if (raw.startsWith('-') || /^-?\d+$/.test(raw)) {
    chatId = Number(raw);
  } else if (!raw.startsWith('@')) {
    chatId = `@${raw}`;
  }

  const deepLink = `https://t.me/miniappzpbot/shop?startapp=p_${product.id}`;
  const storeLink = `https://t.me/miniappzpbot/shop`;
  const caption =
    `🌸 <b>${product.title}</b>\n\n` +
    `${product.description || ''}\n\n` +
    `💰 <b>Ціна: ${Math.round(product.price)} ₴</b>\n` +
    `🚚 <i>Доставка по Львову від 60 хв • Самовивіз: вул. Топольна, 4В</i>\n` +
    `📸 <i>Instagram: @flowers___lviv</i>`;

  const keyboard = new InlineKeyboard()
    .url(`🛍 Замовити букет • ${Math.round(product.price)} ₴`, deepLink)
    .row()
    .url('🌸 Відкрити каталог Flowers Lviv', storeLink);

  if (product.image_url && product.image_url.startsWith('http')) {
    return await bot.api.sendPhoto(chatId, product.image_url, {
      caption,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  } else {
    return await bot.api.sendMessage(chatId, caption, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  }
}

export async function notifyNewOrder(order: Order, items: any[]) {
  if (!bot) return;

  const itemsList = items
    .map((item, idx) => `${idx + 1}. **${item.title}** x${item.quantity} — ${Math.round(item.price * item.quantity)} ₴`)
    .join('\n');

  const text =
    `🎉 **Нове замовлення Flowers Lviv #${order.id}!**\n\n` +
    `👤 **Клієнт:** ${order.customer_name || 'Не вказано'} ${order.customer_username ? `(@${order.customer_username})` : ''}\n` +
    `📞 **Телефон:** ${order.phone || 'Не вказано'}\n` +
    `💬 **Адреса / Коментар:** ${order.comment || '—'}\n\n` +
    `📦 **Склад замовлення:**\n${itemsList}\n\n` +
    `💰 **Разом до сплати:** **${Math.round(order.total_price)} ₴**\n` +
    `📌 **Статус:** Нове (Очікує підтвердження флористом на Топольній)`;

  // Send to admin chat if configured
  if (adminChatId) {
    try {
      await bot.api.sendMessage(adminChatId, text, { parse_mode: 'Markdown' });
    } catch (e: any) {
      console.warn('Failed to send Telegram notification to admin:', e.message);
    }
  }

  // Send confirmation to customer if telegram_user_id is available
  if (order.telegram_user_id && order.telegram_user_id !== adminChatId) {
    try {
      await bot.api.sendMessage(
        order.telegram_user_id,
        `✅ **Ваше замовлення Flowers Lviv #${order.id} прийнято!**\n\n` +
        `📦 **Склад:**\n${itemsList}\n\n` +
        `💰 **До сплати:** **${Math.round(order.total_price)} ₴**\n` +
        `Наші флористи незабаром розпочнуть складання вашого букета!`,
        { parse_mode: 'Markdown' }
      );
    } catch (e: any) {
      console.warn('Failed to send Telegram notification to customer:', e.message);
    }
  }
}

export async function notifyOrderStatusChange(order: Order, newStatus: string) {
  if (!bot) return;

  let statusTitle = '';
  let statusDesc = '';

  switch (newStatus) {
    case 'assembling':
      statusTitle = '🌸 Флорист складає букет';
      statusDesc = 'Ваш букет дбайливо створюється зі свіжих квітів у нашій майстерні!';
      break;
    case 'ready_for_pickup':
      statusTitle = '📦 Букет готовий до видачі';
      statusDesc = 'Квіткова композиція оформлена і чекає на кур\'єра або самовивіз (вул. Топольна, 4В).';
      break;
    case 'in_delivery':
      statusTitle = '🚗 Кур\'єр у дорозі';
      statusDesc = 'Кур\'єр забрав ваш букет і вже прямує за адресою доставки по Львову!';
      break;
    case 'completed':
      statusTitle = '🎉 Букет доставлено!';
      statusDesc = 'Квіти успішно вручено одержувачу. Дякуємо, що обрали Flowers Lviv!';
      break;
    case 'cancelled':
      statusTitle = '❌ Замовлення скасовано';
      statusDesc = 'Замовлення було скасовано.';
      break;
    default:
      statusTitle = `Статус: ${newStatus}`;
      statusDesc = 'Статус вашого замовлення оновлено.';
  }

  const message =
    `📋 **Оновлення замовлення #${order.id}**\n\n` +
    `📌 **${statusTitle}**\n` +
    `${statusDesc}\n\n` +
    `👤 **Одержувач:** ${order.customer_name}\n` +
    `💰 **Сума:** ${Math.round(order.total_price)} ₴`;

  // Send to admin chat
  if (adminChatId) {
    try {
      await bot.api.sendMessage(adminChatId, `🔔 [ФЛОРИСТ / КУР'ЄР]\n${message}`, { parse_mode: 'Markdown' });
    } catch {}
  }

  // Send to customer
  if (order.telegram_user_id && order.telegram_user_id !== adminChatId) {
    try {
      await bot.api.sendMessage(order.telegram_user_id, message, { parse_mode: 'Markdown' });
    } catch {}
  }
}
