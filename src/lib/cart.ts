// lib/cart.ts

export type Product = {
  id: string;
  name: Record<string, string>;
  price: number;
  imageUrl: string;
};

export type CartItem = Product & { quantity: number };

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

export function addToCart(product: Product, quantity: number) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  setLocalStorage('cart', cart);
}

export function updateQuantity(productId: string, quantity: number) {
  const cart = getCart().map(item =>
    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
  );
  setLocalStorage('cart', cart);
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter(item => item.id !== productId);
  setLocalStorage('cart', cart);
}

export function cartTotal(): number {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
}

export function cartCount(): number {
  return getCart().reduce((count, item) => count + item.quantity, 0);
}

export function clearCart() {
  setLocalStorage('cart', []);
}