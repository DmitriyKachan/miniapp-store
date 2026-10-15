# 🌸 Flowers Lviv — Telegram Mini App & E-Commerce Bot

> Повнофункціональний інтернет-магазин авторських букетів та квіткових композицій (Telegram Mini App) студії **Flowers Lviv** ([@flowers___lviv](https://www.instagram.com/flowers___lviv/)) з інтеграцією Telegram Bot API, 100% українською локалізацією, нативним кошиком, Upsell-рекомендаціями, панеллю флориста/адміністратора, інтерфейсом кур'єра та автопостингом у Telegram-канали.

![Telegram WebApp](https://img.shields.io/badge/Telegram-Mini_App-24A1DE?style=for-the-badge&logo=telegram&logoColor=white)
![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Native_Node-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## ✨ Ключові можливості

### 🛍 1. Вітрина клієнта (Flowers Lviv Atelier)
- **Каталог букетів**: *Авторські букети, Троянди та Моно, Квіткові бокси, Півонії та Сезонні, Доповнення до букетів*.
- **Локалізація під Україну та Львів**: ціни в **гривнях (₴)**, графік 10:00–20:00, студія на вул. Топольній, 4В, швидка доставка від 60 хв по Львову, безкоштовна доставка від 1 500 ₴.
- **Чиста українська мова**: 100% інтерфейсу, карток, сповіщень та чекауту державною мовою.
- **Пошук та фільтрація**: миттєвий пошук за назвою або складом букета та зручні категорії.
- **Інтерактивний кошик**:
  - Зручне регулювання кількості букетів.
  - **Upsell-рекомендації («Доповнити букет 🎁»)**: додавання листівки, вази, підкормки Chrysal, цукерок або кульок в 1 клік.
  - Опції анонімного сюрпризу та дзвінка одержувачу кур'єром.
  - Поле для теплого тексту листівки флористу.

### 🛡 2. Панель Флориста (Admin Dashboard)
- **Керування букетами (CRUD)**: створення, редагування цін у гривнях, описів та фотографій.
- **Швидкий перемикач наявності**: миттєве перемикання статусу «В наявності / Закінчився».
- **Керування категоріями**: додавання та редагування категорій з вибором іконок.
- **Керування замовленнями**: фільтрація, перегляд деталей одержувача, зміна статусів (*Нове, Флорист складає букет, Готовий до видачі, В дорозі, Доставлено*).
- **📢 Публікація в Telegram-канал студії**:
  - Миттєва публікація букета в канал з фото, описом, ціною та кнопкою швидкого замовлення в 1 клік.

### 🚗 3. Панель Кур'єра (Courier Dashboard)
- Спеціальний режим для кур'єрів: перелік замовлень «До доставки» та «Доставлені».
- Швидкий виклик клієнта телефоном в один клік.
- Навігація адресою доставки через Google Maps.
- Підтвердження передачі квітів одержувачу з push-сповіщенням клієнту.

---

## 🔒 Безпека та надійність

- 🛡 **Zero-Secret Client**: приватний токен Telegram-бота (`BOT_TOKEN`) повністю ізольований на сервері.
- 🛡 **Захист від SQL-ін'єкцій**: усі запити до SQLite виконуються через параметризовані prepared statements (`?`).
- 🛡 **Безпечне завантаження фотографій**: валідація MIME-типів (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) та обмеження розміру до 10 МБ.
- 🛡 **Захист від XSS**: безпечний рендеринг у React DOM без небезпечних HTML-вставок.

---

## 📁 Структура проекту

```text
miniapp-store/
├── package.json            # Кореневий runner
├── README.md               # Документація проекту
├── backend/                # Серверна частина (Node.js + Express + Telegram Bot)
│   ├── .env.example        # Шаблон змінних оточення
│   ├── src/
│   │   ├── index.ts        # Express сервер
│   │   ├── db.ts           # База даних SQLite
│   │   ├── bot.ts          # Telegram Bot (GrammY) & сповіщення
│   │   └── routes/         # Ендпоінти категорій, букетів, замовлень
│   └── uploads/            # Фотографії букетів
└── frontend/               # Клієнтська частина (React + Vite + Tailwind CSS)
    ├── index.html
    └── src/
        ├── App.tsx         # Головний компонент вітрини
        ├── api/            # API та автономне локальне сховище
        ├── i18n/           # Українська локалізація
        ├── context/        # CartContext, AuthContext, LanguageContext, NotificationContext
        └── components/     # Вітрина, кошик, панель флориста, панель кур'єра
```

---

## 🚀 Швидкий запуск

### 1. Встановлення залежностей
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2. Налаштування змінних оточення
Створіть файл `backend/.env`:
```ini
PORT=5000
BOT_TOKEN=ваш_токен_бота_від_BotFather
WEBAPP_URL=https://dmitriykachan.github.io/miniapp-store/
ADMIN_IDS=ваш_telegram_id
ADMIN_CHAT_ID=-100xxxxxxxxxx
```

### 3. Запуск у режимі розробки
```bash
npm run dev
```
- **Сервер API**: `http://localhost:5000`
- **Вітрина клієнта**: `http://localhost:3000`

### 4. Збірка для продакшну
```bash
npm run build --prefix frontend
```

---

## 🌐 Розгортання (Deployment)

1. **Frontend (GitHub Pages)**:
   - Розгортається на GitHub Pages з гілки `gh-pages`:
   ```bash
   cd frontend && npm run deploy
   ```
   - Доступно онлайн: `https://dmitriykachan.github.io/miniapp-store/`

2. **Backend**:
   - Розгортається на VPS / Render / Railway за допомогою команди:
   ```bash
   npm run start --prefix backend
   ```

---

## 📍 Контакти студії Flowers Lviv
- **Адреса:** м. Львів, вул. Топольна, 4В
- **Графік роботи:** Щодня з 10:00 до 20:00
- **Instagram:** [@flowers___lviv](https://www.instagram.com/flowers___lviv/)

---
MIT License © 2026 Flowers Lviv
