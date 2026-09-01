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
      const keyboard = new InlineKeyboard().webApp('🌸 Otwórz kwiaciarnię', liveUrl);
      
      await ctx.reply(
        `🌸 **Witaj w Flora Boutique!**\n\n` +
        `Świeże kwiaty, autorskie bukiety i wyjątkowe upominki z dostawą pod same drzwi.\n\n` +
        `👇 Kliknij poniższy przycisk, aby otworzyć katalog:`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      );
    });

    bot.start({
      onStart: (info) => {
        console.log(`🤖 Telegram Bot @${info.username} started successfully!`);
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
  const caption = `🌸 <b>${product.title}</b>\n\n${product.description || ''}\n\n💰 <b>Cena: ${product.price} zł</b>\n🚚 <i>Darmowa dostawa od 250 zł • Poczuj świeżość kwiatów!</i>`;

  const keyboard = new InlineKeyboard()
    .url(`🛍 Zamów ten bukiet • ${product.price} zł`, deepLink)
    .row()
    .url('🌸 Otwórz całą kwiaciarnię', storeLink);

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
    .map((item, idx) => `${idx + 1}. **${item.title}** x${item.quantity} — ${item.price * item.quantity} zł`)
    .join('\n');

  const text =
    `🎉 **Nowe zamówienie #${order.id}!**\n\n` +
    `👤 **Klient:** ${order.customer_name || 'Brak danych'} ${order.customer_username ? `(@${order.customer_username})` : ''}\n` +
    `📞 **Telefon:** ${order.phone || 'Brak'}\n` +
    `💬 **Uwagi i dostawa:** ${order.comment || '—'}\n\n` +
    `📦 **Pozycje:**\n${itemsList}\n\n` +
    `💰 **Łącznie:** **${order.total_price} zł**\n` +
    `📌 **Status:** W realizacji`;

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
        `✅ **Twoje zamówienie #${order.id} zostało przyjęte!**\n\n` +
        `📦 **Skład:**\n${itemsList}\n\n` +
        `💰 **Do zapłaty:** **${order.total_price} zł**\n` +
        `Nasi floryści już przygotowują świeże kwiaty!`,
        { parse_mode: 'Markdown' }
      );
    } catch (e: any) {
      console.warn('Failed to send Telegram notification to customer:', e.message);
    }
  }
}
