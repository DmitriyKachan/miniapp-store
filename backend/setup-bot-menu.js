import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve('backend', '.env') });
dotenv.config();

const token = process.env.BOT_TOKEN;
const url = process.env.WEBAPP_URL || 'https://dmitriykachan.github.io/miniapp-store/';

if (!token) {
  console.error('❌ BOT_TOKEN is missing in .env');
  process.exit(1);
}

async function setupBot() {
  console.log('🤖 Updating Telegram Bot Menu Button to GitHub Pages:', url);

  const menuRes = await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      menu_button: {
        type: 'web_app',
        text: '🌸 Otwórz sklep',
        web_app: { url }
      }
    })
  }).then(r => r.json());
  console.log('Set Menu Button result:', menuRes);
}

setupBot();
