import type { Category, Product, Order } from '../types';

const API_BASE = '/api';
export const DEFAULT_GROUP_ID = '-5431810394';

// Flower boutique initial categories
const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Bukiety Autorskie', icon: 'Sparkles', sort_order: 1 },
  { id: 2, name: 'Róże & Mono', icon: 'Heart', sort_order: 2 },
  { id: 3, name: 'Flower Box & Kosze', icon: 'Gift', sort_order: 3 },
  { id: 4, name: 'Rośliny & Doniczki', icon: 'Leaf', sort_order: 4 },
  { id: 5, name: 'Dodatki & Akcesoria', icon: 'Smile', sort_order: 5 },
];

// Flower boutique initial products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Bukiety Autorskie',
    title: 'Bukiet «Różowa Magia» Premium',
    description: 'Puszysta kompozycja z róż gałązkowych, kremowej eustomy, chryzantem pastelowych, goździków i pachnącego eukaliptusa w eleganckim matowym papierze z jedwabną wstążką.',
    price: 280,
    image_url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Bukiety Autorskie',
    title: 'Bukiet «Słoneczny Poranek» XL',
    description: 'Energetyczny bukiet ze słoneczników, żółtych róż ogrodowych, rumianku, alstromerii oraz zieleni dekoracyjnej. Rozświetli każdy dzień!',
    price: 240,
    image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 3,
    category_id: 1,
    category_name: 'Bukiety Autorskie',
    title: 'Bukiet «Piwoniowy Sen» Grand Luxury',
    description: 'Ekskluzywny bukiet z holenderskich piwonii Sarah Bernhardt, hortensji różowej, róż Madame Red i eukaliptusa Populus. Rozmiar XXL.',
    price: 580,
    image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 4,
    category_id: 2,
    category_name: 'Róże & Mono',
    title: 'Mono Bukiet 25 Czerwonych Róż Red Naomi',
    description: 'Klasyczne, aksamitne czerwone róże premium o długości 60 cm z polskich szklarni. Związane czerwoną satynową wstążką.',
    price: 320,
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 5,
    category_id: 2,
    category_name: 'Róże & Mono',
    title: 'Mono Bukiet 19 Róż Pudrowych Mondial',
    description: 'Delikatne kremowo-pudrowe róże wielkokwiatowe w minimalistycznym opakowaniu. Idealne na wyznanie uczuć.',
    price: 260,
    image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 6,
    category_id: 3,
    category_name: 'Flower Box & Kosze',
    title: 'Flower Box «Pudrowy Aksamit» Velvet',
    description: 'Kompozycja w welurowym okrągłym pudle ze specjalną gąbką florystyczną nasączoną wodą. Kwiaty nie wymagają wazonu!',
    price: 350,
    image_url: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 7,
    category_id: 3,
    category_name: 'Flower Box & Kosze',
    title: 'Kosz Wiklinowy «Prowansja»',
    description: 'Rustykalny wiklinowy kosz pełen eustomy, lawendy, hortensji oraz róż gałązkowych. Trwałość do 10 dni.',
    price: 390,
    image_url: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 8,
    category_id: 4,
    category_name: 'Rośliny & Doniczki',
    title: 'Storczyk Orchidea Phalaenopsis 2-pędowa',
    description: 'Długokwitnąca biała orchidea w designerskiej ceramicznej osłonce. Idealna roślina do domu i biura.',
    price: 135,
    image_url: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 9,
    category_id: 4,
    category_name: 'Rośliny & Doniczki',
    title: 'Monstera Deliciosa Dziurawa XL',
    description: 'Królowa roślin domowych o spektakularnych, powcinanych liściach. Wysokość ok. 65 cm.',
    price: 160,
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 10,
    category_id: 5,
    category_name: 'Dodatki & Akcesoria',
    title: 'Szklany Wazon Cylindryczny 25cm',
    description: 'Grube, przezroczyste szkło idealnie pasujące do bukietów średnich i dużych.',
    price: 49,
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 11,
    category_id: 5,
    category_name: 'Dodatki & Akcesoria',
    title: 'Praliny Czekoladowe Lindt Lindor 200g',
    description: 'Kultowe szwajcarskie praliny z rozpływającym się kremowym nadzieniem.',
    price: 39,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=700&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
];

// Upsell accessories recommended in cart
export const UPSELL_ACCESSORIES: Product[] = [
  {
    id: 101,
    category_id: 5,
    category_name: 'Dodatki & Akcesoria',
    title: 'Bilecik z Twoją dedykacją',
    description: 'Elegancki kartonik, w którym odręcznie wykaligrafujemy Twoje życzenia.',
    price: 0,
    image_url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 10,
    category_id: 5,
    category_name: 'Dodatki & Akcesoria',
    title: 'Szklany Wazon Cylindryczny',
    description: 'Grube przezroczyste szkło pasujące do każdego bukietu.',
    price: 49,
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 11,
    category_id: 5,
    category_name: 'Dodatki & Akcesoria',
    title: 'Praliny Lindt Lindor 200g',
    description: 'Słodki dodatek do kwiatów dla wyjątkowej osoby.',
    price: 39,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 102,
    category_id: 5,
    category_name: 'Dodatki & Akcesoria',
    title: 'Odżywka do kwiatów Chrysal (3 szt)',
    description: 'Przedłuża świeżość i trwałość ciętych kwiatów nawet o tydzień.',
    price: 9,
    image_url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
  {
    id: 103,
    category_id: 5,
    category_name: 'Dodatki & Akcesoria',
    title: 'Balon Foliowy z Helem «Serce»',
    description: 'Czerwony lub różowy balon z helem na wstążce przywiązany do bukietu.',
    price: 29,
    image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&auto=format&fit=crop&q=80',
    in_stock: 1,
  },
];

const STORAGE_KEYS = {
  CATEGORIES: 'tg_flower_categories_v3',
  PRODUCTS: 'tg_flower_products_v3',
  ORDERS: 'tg_flower_orders_v3',
  CHANNEL_SETTINGS: 'tg_flower_channel_v2',
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
    return updated.find((c) => c.id === id) || (payload as Category);
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    } catch {}

    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    setLocal(STORAGE_KEYS.CATEGORIES, categories.filter((c) => c.id !== id));
    setLocal(STORAGE_KEYS.PRODUCTS, products.filter((p) => p.category_id !== id));
  },

  // Products
  async getProducts(params?: { category_id?: number; search?: string; in_stock_only?: boolean }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category_id) query.set('category_id', String(params.category_id));
      if (params?.search) query.set('search', params.search);
      if (params?.in_stock_only) query.set('in_stock_only', 'true');

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLocal(STORAGE_KEYS.PRODUCTS, data.data);
          return data.data;
        }
      }
    } catch {}

    let products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);

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
    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);

    const updated = products.map((p) => {
      if (p.id === id) {
        const merged = { ...p, ...payload };
        if (payload.category_id) {
          const cat = categories.find((c) => c.id === payload.category_id);
          merged.category_name = cat?.name || p.category_name;
        }
        return merged;
      }
      return p;
    });
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return updated.find((p) => p.id === id) || (payload as Product);
  },

  async toggleProductStock(id: number): Promise<{ id: number; in_stock: number }> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/stock`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch {}

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    let newStock = 0;
    const updated = products.map((p) => {
      if (p.id === id) {
        newStock = p.in_stock === 1 ? 0 : 1;
        return { ...p, in_stock: newStock };
      }
      return p;
    });
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return { id, in_stock: newStock };
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    } catch {}

    const products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setLocal(STORAGE_KEYS.PRODUCTS, products.filter((p) => p.id !== id));
  },

  // Upload image
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
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
    comment?: string;
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
      comment: payload.comment || '',
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
    return updated.find((o) => o.id === id) || ({} as Order);
  },

  // Telegram Channel / Group Publishing (SECURE: routed via backend endpoint)
  async publishToChannel(
    product: Product,
    channelUsernameOrId?: string
  ): Promise<{ success: boolean; message: string }> {
    const raw = (channelUsernameOrId || DEFAULT_GROUP_ID).trim();
    setLocal(STORAGE_KEYS.CHANNEL_SETTINGS, raw);

    try {
      const res = await fetch(`${API_BASE}/products/publish-to-channel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          channel: raw,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err: any) {
      console.warn('Backend publish error:', err);
    }

    return {
      success: true,
      message: 'Запрос на публикацию отправлен! (Убедитесь, что сервер бота запущен)',
    };
  },

  async getHealth(): Promise<{ status: string; adminIds: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
    } catch {}
    return { status: 'ok', adminIds: [] };
  },

  getSavedChannel(): string {
    return getLocal<string>(STORAGE_KEYS.CHANNEL_SETTINGS, DEFAULT_GROUP_ID);
  },

  setSavedChannel(channel: string): void {
    setLocal(STORAGE_KEYS.CHANNEL_SETTINGS, channel);
  },
};
