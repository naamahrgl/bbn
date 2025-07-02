// src/components/CartPage.tsx
import React, { useState, useEffect } from 'react';
import { getCart, updateQuantity, removeFromCart, cartTotal, cartCount } from '../lib/cart';
import { getProductById } from '../lib/products';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

type Lang = 'he' | 'en';

interface CartPageProps {
  lang: Lang;
}

const translations = {
  he: {
    emptyTitle: "העגלה ריקה",
    emptyDesc: "לחצו על כפתור ההוספה בעמוד המוצרים",
    title: "העגלה שלך",
    summary: "סיכום הזמנה",
    totalItems: (count: number) => `סה״כ (${count} פריטים)`,
    vat: "כולל מע״מ",
    toPay: "לתשלום",
    checkout: "לתשלום",
        delivery_note: 'ייתכן שתתווסף עלות משלוח',
    go_shopping: "לעמוד המוצרים"
  },
  en: {
    emptyTitle: "Your cart is empty",
    emptyDesc: "Click the add button on the products page",
    title: "Your Cart",
    summary: "Order Summary",
    totalItems: (count: number) => `Total (${count} items)`,
    vat: "Including VAT",
    toPay: "Total",
    checkout: "Checkout",
        delivery_note: 'Delivery fee may apply',
    go_shopping: "Go shopping"
  }
};

export default function CartPage({ lang }: CartPageProps) {
  const t = translations[lang];
  const [cartItems, setCartItems] = useState(getCart());

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
    setCartItems(getCart());
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setCartItems(getCart());
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-stone-300" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-brand-dark">{t.emptyTitle}</h1>
        <p className="mt-2 text-brand-light">{t.emptyDesc}</p>
        <a
          href={`/${lang}/products`}
          className="inline-block bg-brand-secondary text-white px-6 py-2 rounded hover:bg-[#703c31]"
        >
          {t.go_shopping}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-brand-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-8 text-center" style= {{ color: 'var(--brand-text-title)' }}>{t.title}</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-brand-primary">
            {cartItems.map(item => {
              const product = getProductById(item.id);
              return (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                  <img src={product.imageUrls[0]} alt={product.name[lang]} className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover" />
                  <div className="flex-grow text-start">
                    <h3 className="font-semibold text-brand-dark">{product.name[lang]}</h3>
                    <p className="text-sm text-brand-light">₪{product.price.toFixed(2)}</p>
                    <div className="flex items-center rounded-md border border-stone-300 w-fit mt-2">
                      <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="font-semibold text-brand-dark">₪{(product.price * item.quantity).toFixed(2)}</p>
                    <button className="text-brand-light hover:text-red-500 mt-2" onClick={() => handleRemove(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-brand-primary sticky top-24 text-start">
              <h2 className="text-xl font-semibold border-b pb-4">{t.summary}</h2>
              <div className="flex justify-between mt-4 text-brand-light">
                <p>{t.totalItems(cartCount())}</p>
                <p>₪{cartTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-2 text-brand-light">
                <p>{t.vat}</p>
                <p>-</p>
              </div>
              <div className="flex justify-between mt-4 font-bold text-lg border-t pt-4">
                <p>{t.toPay}</p>
                <p>₪{cartTotal().toFixed(2)}</p>
              </div>
                      <p className="text-xs text-stone-500 mt-2">{t.delivery_note}</p>
<a href={`/${lang}/checkout`}>
                <button className="w-full mt-6 bg-[var(--big-buttons)] hover:bg-[var(--big-buttons-hover)] text-white py-2 rounded-md flex justify-center items-center gap-2">
                  <span>{t.checkout}</span>
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
