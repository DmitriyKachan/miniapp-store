# 🌸 Flora Boutique — Telegram Mini App & E-Commerce Bot

> Современный полнофункциональный интернет-магазин цветов и подарков (Telegram Mini App) с интеграцией Telegram Bot API, мультиязычностью (PL / RU / UA), нативной корзиной с Upsell-рекомендациями, панелью администратора и автопостингом в Telegram-каналы с интерактивными кнопками покупок.

![Telegram WebApp](https://img.shields.io/badge/Telegram-Mini_App-24A1DE?style=for-the-badge&logo=telegram&logoColor=white)
![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-26+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Native_Node_26-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## ✨ Ключевые возможности

### 🛍 1. Витрина покупателя (Flora Boutique)
- **Каталог цветов и подарков**: *Bukiety Autorskie, Róże & Mono, Flower Box & Kosze, Rośliny & Doniczki, Dodatki & Akcesoria*.
- **Польский манер и валюта**: цены в **zł (PLN)**, форматы телефонов `+48 XXX XXX XXX`, адреса доставки и Paczkomaty InPost.
- **Мультиязычность**: мгновенный переключатель 3 языков (**🇷🇺 Русский**, **🇵🇱 Polski**, **🇺🇦 Українська**) с сохранением выбора.
- **Поиск и фильтрация**: живой поиск по названию/описанию и плавные чипы категорий.
- **Интерактивная корзина**:
  - Быстрое изменение количества товаров и расчет суммы.
  - **Upsell-рекомендации («Coś do bukietu? 🎁»)**: добавление в 1 клик открытки с пожеланием, вазы, шоколада Lindt, подкормки Chrysal и шаров.
  - Поле для ввода текста открытки, передаваемое флористу.

### 🛡 2. Панель Администратора (Admin Dashboard)
- **Управление товарами (CRUD)**: создание букетов с загрузкой фотографий, редактирование цен, описаний и категорий.
- **Быстрый переключатель наличия**: мгновенное переключение статуса «В наличии / Закончился».
- **Управление категориями**: добавление новых категорий с выбором иконок (Lucide Icons) и сортировкой.
- **Управление заказами**: просмотр истории заказов, деталей клиентов, состава и смена статусов (*Pending, Paid, Completed, Cancelled*).
- **📢 Автопостинг в Telegram-канал/группу**:
  - Публикация букета прямо из админки в Telegram-канал с фотографией, описанием, ценой и нативной кнопкой заказа: `[ 🛍 Zamów ten bukiet • {cena} zł ]`.

### 🔗 3. Бесшовный Deep-linking (`t.me/<bot>/<app>?startapp=p_{id}`)
- Переход по кнопке из любого поста в Telegram открывает Mini App **напрямую внутри Telegram** сразу на карточке именно этого букета.

---

## 🔒 Безопасность и защита от взлома (Security Hardening)

- 🛡 **Zero-Secret Client**: приватный токен Telegram-бота (`BOT_TOKEN`) **полностью изолирован на бэкенде** и никогда не попадает во фронтенд-бандл или публичный репозиторий.
- 🛡 **Защита от SQL-инъекций**: все запросы к базе данных выполняются через параметризованные запросы (`node:sqlite` Prepared Statements с плейсхолдерами `?`).
- 🛡 **Безопасная загрузка файлов (`multer`)**:
  - Валидация MIME-типов (`image/jpeg`, `image/png`, `image/webp`, `image/gif`).
  - Ограничение размера файлов (до 5 МБ).
  - Генерация криптографически безопасных случайных имен файлов (UUID + timestamp) для предотвращения Path Traversal и перезаписи системных файлов.
- 🛡 **Защита от XSS и HTML Injection**: экранирование HTML-тегов в описаниях сообщений Telegram и безопасный рендеринг в React DOM (без использования `dangerouslySetInnerHTML`).
- 🛡 **Изоляция секретов**: файл `.env` надежно внесен в `.gitignore` со всеми масками файлов окружения и дампов БД.

---

## 📁 Структура проекта

```text
miniapp/
├── .gitignore              # Исключения секретов, зависимостей и временных файлов
├── package.json            # Корневой runner (concurrently)
├── README.md               # Документация проекта
├── backend/                # Серверная часть (API + Telegram Bot)
│   ├── .env.example        # Шаблон переменных окружения
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts        # Express сервер
│   │   ├── db.ts           # SQLite база данных и начальные данные
│   │   ├── bot.ts          # GrammY Telegram Bot & Channel Publisher
│   │   └── routes/
│   │       ├── categories.ts
│   │       ├── products.ts
│   │       ├── orders.ts
│   │       └── upload.ts
│   └── uploads/            # Загруженные изображения
└── frontend/               # Клиентская часть (React Mini App)
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── App.tsx         # Главный компонент и роутер
        ├── types/          # TypeScript интерфейсы
        ├── api/            # API-клиент с автономным оффлайн-фоллбэком
        ├── i18n/           # Словари языков (RU, PL, UA)
        ├── context/        # CartContext, AuthContext, LanguageContext
        ├── components/     # UI-компоненты (Header, ProductCard, CartView и др.)
        └── utils/          # Telegram WebApp SDK helpers и тактильная отдача (Haptics)
```

---

## 🚀 Быстрый запуск

### 1. Требования
- Node.js версии **20+** (рекомендуется **Node.js 22 или 26**)
- npm версии **10+**

### 2. Установка зависимостей
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Настройка окружения
Скопируйте пример файла конфигурации:
```bash
cp backend/.env.example backend/.env
```
Заполните параметры в `backend/.env`:
```ini
PORT=5000
BOT_TOKEN=ваш_токен_бота_из_BotFather
WEBAPP_URL=https://dmitriykachan.github.io/miniapp-store/
ADMIN_IDS=ваш_telegram_id
ADMIN_CHAT_ID=-100xxxxxxxxxx
```

### 4. Запуск в режиме разработки
```bash
npm run dev
```
- **Бэкенд API**: `http://localhost:5000`
- **Фронтенд витрина**: `http://localhost:3000`
- **Telegram Bot**: автоматически запустится и подключится к Telegram.

### 5. Сборка фронтенда для продакшна
```bash
npm run build --prefix frontend
```

---

## 🌐 Развертывание (Deployment)

1. **Frontend (GitHub Pages)**:
   - Собранный бандл из `frontend/dist` разворачивается на GitHub Pages:
   ```bash
   npx gh-pages -d frontend/dist -b gh-pages
   ```
   - Доступен 24/7 по всему миру через Fastly Global CDN.

2. **Backend (Node.js)**:
   - Может быть запущен на любом хостинге (Render, Railway, Amvera, VPS) с помощью команды `npm run start --prefix backend`.

---

## 📄 Лицензия
MIT License © 2026 Flora Boutique
