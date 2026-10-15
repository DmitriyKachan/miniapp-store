import type { Category, Product, Order } from '../types';

const API_BASE = '/api';
export const DEFAULT_GROUP_ID = '-5431810394';

// Flower boutique initial categories
// Flowers Lviv initial categories
const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Авторські букети', icon: 'Sparkles', sort_order: 1 },
  { id: 2, name: 'Троянди & Монобукети', icon: 'Heart', sort_order: 2 },
  { id: 3, name: 'Flower Box & Кошики', icon: 'Gift', sort_order: 3 },
  { id: 4, name: 'Кімнатні рослини & Орхідеї', icon: 'Leaf', sort_order: 4 },
  { id: 5, name: 'Подарунки & Аксесуари', icon: 'Smile', sort_order: 5 },
];

// Flowers Lviv rich initial products (UAH prices)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Авторські букети',
    title: 'Букет «Рожева Магія» Преміум',
    description: 'Пишна авторська композиція з кущових півонієподібних троянд, ніжної кремової еустоми, хризантем, гвоздик та свіжого евкаліпта у фірмовому пакуванні.',
    price: 1650,
    image_url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Авторські букети',
    title: 'Букет «Сонячний Ранок» XL',
    description: 'Життєрадісний яскравий букет із добірних соняшників, теплих жовтих троянд, ромашок, альстромерій та зелені. Наповнює дім теплом!',
    price: 1350,
    image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 3,
    category_id: 1,
    category_name: 'Авторські букети',
    title: 'Букет «Півонієвий Сон» Grand Luxury',
    description: 'Ексклюзивний букет королівського масштабу: голландські півонії Sarah Bernhardt, пишна рожева гортензія, сортові троянди та евкаліпт Populus. Розмір XXL.',
    price: 3200,
    image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 4,
    category_id: 2,
    category_name: 'Троянди & Монобукети',
    title: 'Монобукет із 25 червоних троянд Red Naomi',
    description: 'Класичні оксамитові червоні троянди найвищого ґатунку висотою 60 см. Ідеальний і перевірений символ справжнього палкого кохання.',
    price: 1850,
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 5,
    category_id: 2,
    category_name: 'Троянди & Монобукети',
    title: 'Монобукет із 19 пудрових троянд Mondial',
    description: 'Ніжні кремово-пудрові троянди з великими хвилястими пелюстками в лаконічній дизайнерській матовій упаковці.',
    price: 1450,
    image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 6,
    category_id: 3,
    category_name: 'Flower Box & Кошики',
    title: 'Flower Box «Пудровий Оксамит» Velvet',
    description: 'Стильна кругла оксамитова коробка Flowers Lviv на флористичній губці з водою. Квіти не потребують вази та довго стоять!',
    price: 1950,
    image_url: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 7,
    category_id: 3,
    category_name: 'Flower Box & Кошики',
    title: 'Плетений кошик квітів «Прованс»',
    description: 'Ароматна та повітряна композиція в натуральному плетеному кошику: гортензія, гілочки лаванди, півонієподібна троянда та еустома. Стійкість до 10 днів.',
    price: 2400,
    image_url: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 8,
    category_id: 4,
    category_name: 'Кімнатні рослини & Орхідеї',
    title: 'Орхідея Фаленопсис 2-стовбурова в кашпо',
    description: 'Елегантна білосніжна орхідея преміум-сорту в керамічному дизайнерському кашпо. Квітне до 3–4 місяців.',
    price: 850,
    image_url: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 9,
    category_id: 4,
    category_name: 'Кімнатні рослини & Орхідеї',
    title: 'Монстера делікатесна (Monstera Deliciosa) XL',
    description: 'Розкішна кімнатна рослина з великим різьбленим смарагдовим листям. Висота 65–70 см.',
    price: 950,
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 10,
    category_id: 5,
    category_name: 'Подарунки & Аксесуари',
    title: 'Скляна циліндрична ваза 25 см',
    description: 'Міцне прозоре скло класичної форми. Ідеально підходить для букетів середнього та великого розміру.',
    price: 350,
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 11,
    category_id: 5,
    category_name: 'Подарунки & Аксесуари',
    title: 'Цукерки Ferrero Rocher / Raffaello 200г',
    description: 'Вишукані шоколадні цукерки у святковій упаковці — найкращий солодкий комплімент до букета.',
    price: 240,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 12,
    category_id: 2,
    category_name: 'Троянди & Монобукети',
    title: '51 червона троянда «Палаюче Кохання»',
    description: 'Незабутній букет із 51 свіжої червоної троянди 60 см від майстрів Flowers Lviv. Ідеально для пропозиції та річниці.',
    price: 3600,
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 13,
    category_id: 1,
    category_name: 'Авторські букети',
    title: 'Букет «Ніжна Гортензія & Еустома»',
    description: 'Повітряний блакитно-кремовий авторський букет з об’ємної гортензії, білої еустоми, фрезії та евкаліпта.',
    price: 1550,
    image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 14,
    category_id: 2,
    category_name: 'Троянди & Монобукети',
    title: 'Весняний мікс із 35 тюльпанів «Львівський Ранок»',
    description: 'Ніжний та свіжий мікс із добірних тюльпанів пастельних, рожевих та сонячних відтінків у крафті.',
    price: 1250,
    image_url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 15,
    category_id: 3,
    category_name: 'Flower Box & Кошики',
    title: 'Flower Box «Пристрасть & Золото» 29 троянд',
    description: 'Елегантна преміальна коробка з золотим тисненням, наповнена 29 оксамитовими бордовими трояндами.',
    price: 2150,
    image_url: 'https://images.unsplash.com/photo-1589244159943-460088ed5c92?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 16,
    category_id: 3,
    category_name: 'Flower Box & Кошики',
    title: 'Королівський кошик 101 троянда «Імператор»',
    description: 'Гігантський кошик ручної роботи зі 101 свіжої троянди. Справжній шедевр студії Flowers Lviv.',
    price: 6800,
    image_url: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 17,
    category_id: 1,
    category_name: 'Авторські букети',
    title: 'Букет авторський «Лавандовий Світанок»',
    description: 'Витончений букет у фіолетово-рожевих відтінках: левкої, кущові троянди, лімоніум та евкаліпт.',
    price: 1200,
    image_url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 18,
    category_id: 2,
    category_name: 'Троянди & Монобукети',
    title: 'Монобукет із 15 півонієподібних троянд «Misty Bubbles»',
    description: 'Круглі шароподібні троянди насиченого малинового кольору з п’янким ароматом.',
    price: 1400,
    image_url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 19,
    category_id: 1,
    category_name: 'Авторські букети',
    title: 'Букет «Вершковий Пломбір» із садовими трояндами',
    description: 'Ніжний кремово-ванільний букет із французьких садових троянд garden, гіпсофіли та білих альстромерій.',
    price: 1750,
    image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 20,
    category_id: 3,
    category_name: 'Flower Box & Кошики',
    title: 'Flower Box «Сонячні Промені»',
    description: 'Яскрава коробочка з міні-соняшниками, ромашкою та жовтими кущовими трояндами.',
    price: 1100,
    image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 21,
    category_id: 2,
    category_name: 'Троянди & Монобукети',
    title: '101 ніжно-рожева троянда «Aqua Romance»',
    description: 'Приголомшливий букет зі 101 рожевої троянди для найдорожчої людини у світі.',
    price: 6500,
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 22,
    category_id: 3,
    category_name: 'Flower Box & Кошики',
    title: 'Композиція «Лісова Казка» у дерев’яному кашпо',
    description: 'Еко-композиція в натуральному дерев’яному ящичку зі стабілізованим мохом, міні-трояндами та сукулентами.',
    price: 1600,
    image_url: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 23,
    category_id: 1,
    category_name: 'Авторські букети',
    title: 'Букет «Чисте Натхнення» з білих лілій та троянд',
    description: 'Шляхетний білий букет з ароматних східних лілій, білих троянд Avalanche та евкаліпта.',
    price: 1650,
    image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 24,
    category_id: 2,
    category_name: 'Троянди & Монобукети',
    title: 'Букет із 11 пухнастих гортензій «Хмаринка Ніжності»',
    description: 'Величезний оберемок свіжих сортових гортензій пастельно-рожевих, білих та блакитних кольорів.',
    price: 2100,
    image_url: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
];

// Upsell accessories recommended in cart (UAH prices)
export const UPSELL_ACCESSORIES: Product[] = [
  {
    id: 101,
    category_id: 5,
    category_name: 'Подарунки & Аксесуари',
    title: 'Авторська листівка з вашим текстом (від руки)',
    description: 'Красива фірмова листівка Flowers Lviv, підписана флористом каліграфічним почерком.',
    price: 0,
    image_url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 10,
    category_id: 5,
    category_name: 'Подарунки & Аксесуари',
    title: 'Скляна циліндрична ваза 25 см',
    description: 'Ідеально підходить за висотою та об’ємом для букета.',
    price: 350,
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 11,
    category_id: 5,
    category_name: 'Подарунки & Аксесуари',
    title: 'Цукерки Ferrero Rocher / Raffaello',
    description: 'Солодкий та смачний додаток до квітів.',
    price: 240,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 102,
    category_id: 5,
    category_name: 'Подарунки & Аксесуари',
    title: 'Підживлення для квітів Chrysal (3 саше)',
    description: 'Продовжує життя квітів у вазі до 2 тижнів.',
    price: 0,
    image_url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 103,
    category_id: 5,
    category_name: 'Подарунки & Аксесуари',
    title: 'Повітряна кулька з гелієм «Серце»',
    description: 'Глянцеве фольговане серце на шовковій стрічці до букета.',
    price: 180,
    image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
];

const STORAGE_KEYS = {
  CATEGORIES: 'tg_flowers_lviv_categories_v2',
  PRODUCTS: 'tg_flowers_lviv_products_v2',
  ORDERS: 'tg_flowers_lviv_orders_v2',
  CHANNEL_SETTINGS: 'tg_flowers_lviv_channel_v2',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export const api = {
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLocal(STORAGE_KEYS.CATEGORIES, data.data);
          return data.data;
        }
      }
    } catch {}
    return getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async createCategory(payload: { name: string; icon?: string; sort_order?: number }): Promise<Category> {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const newCat: Category = {
      id: Date.now(),
      name: payload.name,
      icon: payload.icon || 'Sparkles',
      sort_order: payload.sort_order || 0,
    };
    const updated = [...categories, newCat];
    setLocal(STORAGE_KEYS.CATEGORIES, updated);
    return newCat;
  },

  async updateCategory(id: number, payload: Partial<Category>): Promise<Category> {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = categories.map((c) => (c.id === id ? { ...c, ...payload } : c));
    setLocal(STORAGE_KEYS.CATEGORIES, updated);
    return updated.find((c) => c.id === id)!;
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    } catch {}

    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setLocal(
      STORAGE_KEYS.CATEGORIES,
      categories.filter((c) => c.id !== id)
    );
  },

  // Products
  async getProducts(params?: {
    category_id?: number;
    in_stock_only?: boolean;
    search?: string;
  }): Promise<Product[]> {
    let products: Product[] = [];

    try {
      const query = new URLSearchParams();
      if (params?.category_id) query.append('category_id', String(params.category_id));
      if (params?.in_stock_only) query.append('in_stock_only', '1');
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          products = data.data;
          setLocal(STORAGE_KEYS.PRODUCTS, products);
        }
      }
    } catch {}

    if (products.length === 0) {
      products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }

    const categories = await this.getCategories();
    products = products.map((p) => {
      const cat = categories.find((c) => c.id === p.category_id);
      return { ...p, category_name: cat?.name || p.category_name || '' };
    });

    if (params?.category_id) {
      products = products.filter((p) => p.category_id === params.category_id);
    }
    if (params?.in_stock_only) {
      products = products.filter((p) => p.in_stock === 1);
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      products = products.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    return products;
  },

  async createProduct(
    payload: Omit<Product, 'id' | 'created_at'>,
    options?: { publish_to_channel?: boolean; channel_username?: string }
  ): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, ...options }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const cat = categories.find((c) => c.id === payload.category_id);

    const newProd: Product = {
      ...payload,
      id: Date.now(),
      category_name: cat?.name || '',
      created_at: new Date().toISOString(),
    };
    setLocal(STORAGE_KEYS.PRODUCTS, [newProd, ...products]);

    if (options?.publish_to_channel) {
      const targetChannel = options.channel_username || DEFAULT_GROUP_ID;
      await this.publishToChannel(newProd, targetChannel);
    }

    return newProd;
  },

  async updateProduct(id: number, payload: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = products.map((p) => (p.id === id ? { ...p, ...payload } : p));
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return updated.find((p) => p.id === id)!;
  },

  async toggleProductStock(id: number): Promise<Product> {
    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const prod = products.find((p) => p.id === id);
    const newStock = prod ? (prod.in_stock === 1 ? 0 : 1) : 1;
    return this.updateProduct(id, { in_stock: newStock });
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn(`Local deletion fallback for #${id}`);
    }

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = products.filter((p) => Number(p.id) !== Number(id));
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
  },

  // Telegram Group & Channel Publishing
  async publishToChannel(product: Product, channelUsername: string): Promise<{ success: boolean; message: string }> {
    const rawTarget = channelUsername.trim();
    if (!rawTarget) {
      throw new Error('Вкажіть @username або ID каналу');
    }

    setLocal(STORAGE_KEYS.CHANNEL_SETTINGS, rawTarget);

    try {
      const res = await fetch(`${API_BASE}/products/publish-to-channel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_username: rawTarget,
          product_id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          image_url: product.image_url,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          return { success: true, message: 'Опубліковано через бекенд' };
        } else {
          throw new Error(data.error || 'Помилка публікації');
        }
      }
    } catch (e: any) {
      console.warn('Backend publish failed, info:', e.message);
    }

    return {
      success: true,
      message: `Товар збережено. Налаштуйте канал ${rawTarget} у Telegram.`,
    };
  },

  getSavedChannel(): string {
    return getLocal<string>(STORAGE_KEYS.CHANNEL_SETTINGS, DEFAULT_GROUP_ID);
  },

  // Upload image
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/products/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          filename: file.name,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    return getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async createOrder(payload: {
    telegram_user_id?: string;
    customer_name: string;
    customer_username?: string;
    phone?: string;
    address?: string;
    comment?: string;
    delivery_date?: string;
    delivery_time?: string;
    is_surprise?: boolean;
    need_call_recipient?: boolean;
    items: { id: number; title: string; price: number; quantity: number; image_url?: string }[];
    total_price: number;
  }): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const newOrder: Order = {
      id: Math.floor(Math.random() * 89999 + 10000),
      telegram_user_id: payload.telegram_user_id || '',
      customer_name: payload.customer_name,
      customer_username: payload.customer_username || '',
      phone: payload.phone || '',
      address: payload.address || '',
      comment: payload.comment || '',
      delivery_date: payload.delivery_date || '',
      delivery_time: payload.delivery_time || '',
      is_surprise: !!payload.is_surprise,
      need_call_recipient: !!payload.need_call_recipient,
      total_price: payload.total_price,
      status: 'pending',
      items: payload.items,
      created_at: new Date().toISOString(),
    };

    setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);
    return newOrder;
  },

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setLocal(STORAGE_KEYS.ORDERS, updated);
    return updated.find((o) => o.id === id)!;
  },

  async getHealth(): Promise<{ status: string; adminIds?: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
    } catch {}
    return { status: 'offline' };
  },
};
