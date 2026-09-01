export interface Category {
  id: number;
  name: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  in_stock: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: number;
  telegram_user_id: string;
  customer_name: string;
  customer_username: string;
  phone: string;
  comment: string;
  total_price: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  items_json?: string;
  items: OrderItem[];
  created_at: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}
