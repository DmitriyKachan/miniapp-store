export interface Category {
  id: number;
  name: string;
  name_ru?: string;
  name_pl?: string;
  name_ua?: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  title: string;
  title_ru?: string;
  title_pl?: string;
  title_ua?: string;
  description: string;
  description_ru?: string;
  description_pl?: string;
  description_ua?: string;
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

export type OrderStatus =
  | 'pending'
  | 'assembling'
  | 'ready_for_pickup'
  | 'in_delivery'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: number;
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
  total_price: number;
  status: OrderStatus;
  items?: OrderItem[];
  created_at: string;
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export type UserRole = 'buyer' | 'admin' | 'courier';
