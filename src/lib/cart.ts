// lib/cart.ts
import type { ProductId, Product } from './products';
import { PRODUCTS } from './products';

export type CartItem = {
  id: ProductId;
  quantity: number;
  size?: string;
  price?: number;
  multiplier?: number;
};
function getCurrentLang(): 'he' | 'en' {
  if (typeof window === 'undefined') return 'he';
  const pathLang = window.location.pathname.split('/')[1];
  if (pathLang === 'en') return 'en';
  return 'he';
}

function safeLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalStorage<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getCart(): CartItem[] {
  return safeLocalStorage<CartItem[]>('cart', []);
}

export function addToCart(product: Product, quantity: number, size?: string, price?: number) {
  // ✅ 1. apply default size & price if not provided
const defaultVariant = product.variants?.[0] ?? { size: { he: '', en: '' }, price: product.price };
  const lang = getCurrentLang();

  const finalSize = size || defaultVariant?.size?.[lang] || '';
  const finalPrice = price ?? defaultVariant?.price ?? product.price;
  
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id && item.size === finalSize);

  if (existing) {
    existing.quantity += quantity;
  } else {
    const cartItem: CartItem = {
      id: product.id as ProductId,
      quantity,
      size: finalSize,
      price: finalPrice
    };
    cart.push(cartItem);
    console.log('cartitem added:', cartItem);
  }

  setLocalStorage('cart', cart);
  window.dispatchEvent(new Event("storage"));
}

// ✅ FIXED cartTotal() to use variant price if present
export function cartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product || !product.isAvailable) return total;
    const effectivePrice = item.price ?? product.price;
    return total + effectivePrice * item.quantity;
  }, 0);
}

export function updateQuantity(productId: string, quantity: number) {
  const cart = getCart().map(item =>
    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
  );
  setLocalStorage('cart', cart);
}

export function removeFromCart(productId: string, size?: string) {
  const cart = getCart().filter(item => {
    // remove only if both id and size match
    if (size) {
      return !(item.id === productId && item.size === size);
    }
    // if no size provided, remove all with that id
    return item.id !== productId;
  });

  setLocalStorage('cart', cart);
  window.dispatchEvent(new Event("storage"));
}


export function cartCount(): number {
  return getCart().reduce((count, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product || !product.isAvailable) return count;
    return count + item.quantity;
  }, 0);
}

export function clearCart() {
  setLocalStorage('cart', []);
}
