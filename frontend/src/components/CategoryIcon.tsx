import React from 'react';
import {
  Coffee,
  Cake,
  Shirt,
  Headphones,
  Sparkles,
  ShoppingBag,
  Gift,
  Smartphone,
  Utensils,
  Heart,
  Package,
  Flame,
  Watch,
  BookOpen,
} from 'lucide-react';

export const ICON_OPTIONS = [
  { name: 'Coffee', label: 'Кофе / Напитки', Icon: Coffee },
  { name: 'Cake', label: 'Десерты / Еда', Icon: Cake },
  { name: 'Shirt', label: 'Одежда / Мерч', Icon: Shirt },
  { name: 'Headphones', label: 'Гаджеты / Звук', Icon: Headphones },
  { name: 'Smartphone', label: 'Смартфоны', Icon: Smartphone },
  { name: 'Sparkles', label: 'Новинки / Акции', Icon: Sparkles },
  { name: 'Flame', label: 'Хиты продаж', Icon: Flame },
  { name: 'Gift', label: 'Подарки', Icon: Gift },
  { name: 'Watch', label: 'Аксессуары', Icon: Watch },
  { name: 'BookOpen', label: 'Книги / Обучение', Icon: BookOpen },
  { name: 'Utensils', label: 'Ресторан / Кухня', Icon: Utensils },
  { name: 'Heart', label: 'Красота / Здоровье', Icon: Heart },
  { name: 'ShoppingBag', label: 'Магазин', Icon: ShoppingBag },
  { name: 'Package', label: 'Товары общего типа', Icon: Package },
];

export const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Coffee': return <Coffee className={className} />;
    case 'Cake': return <Cake className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'Headphones': return <Headphones className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Gift': return <Gift className={className} />;
    case 'Watch': return <Watch className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Utensils': return <Utensils className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    default: return <Package className={className} />;
  }
};
