// src/components/ProductCard.tsx

import React from 'react';
import { addToCart } from '../lib/cart';
import type { Product } from '../lib/products';
import { Button } from './ui/button';
import { tagLabels } from '../lib/products';

declare const gtag: (...args: any[]) => void;
declare const fbq: (...args: any[]) => void;



const translations = {
  he: {
    addToCart: 'הוספה לעגלה',
    added: 'המוצר נוסף לעגלה'
  },
  en: {
    addToCart: 'Add to Cart',
    added: 'Item added to cart'
  }
};

type ProductCardProps = {
  product: Product & { quantity?: number };
  lang: 'he' | 'en';
};

export default function ProductCard({ product, lang }: ProductCardProps) {
  const t = (key: keyof typeof translations['he']) => translations[lang][key];

  const handleAddToCart = () => {
    const quantity = product.quantity ?? 1;
    addToCart(product, quantity);
    gtag('event', 'add_to_cart', {
  currency: 'ILS',
  value: product.price,
  items: [{
    item_name: product.name[lang],
    item_id: product.id,
    quantity: 1,
    item_list_name: 'Featured Products'
  }]
});

fbq('track', 'AddToCart', {
  content_name: product.name[lang],
  content_ids: [product.id],
  content_type: 'product',
  currency: 'ILS',
  value: product.price
});

    alert(lang === 'he' ? 'המוצר נוסף לעגלה' : 'Item added to cart')

  };

  return (
<div className="relative bg-[var(--brand-lighter)] rounded-lg shadow-sm border border-[#d0b8a8] overflow-hidden text-left rtl:text-right">
      <a href={`/${lang}/products?id=${product.id}`}>
      
        <img
          src={product.imageUrls[0]}
          alt={product.name[lang]}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[var(--brand-text-dark)]">
            {product.name[lang]}
          </h3>
          <p className="text-sm text-brand-light mt-1 text-left rtl:text-right">
            ₪{product.price.toFixed(2)}
          </p>
        </div>
          {/* Floating tag label */}
  {product.tags?.map(tag => {
    const label = tagLabels[lang][tag.key];
    const isExpired =
      tag.key === 'limited' && tag.until && new Date(tag.until) < new Date();

    if (!label || isExpired) return null;

    return (
      <div
        key={tag.key}
        className="absolute top-2 left-2 bg-[var(--big-buttons)] text-[var(--brand-lighter)] text-xs font-semibold px-2 py-1 rounded-full shadow z-10"
      >
        {label}
      </div>
    );
  })}

      </a>
      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-[var(--small-buttons)] hover:bg-[var(--small-buttons-hover)] text-white font-medium py-2 rounded">
          {t('addToCart')}
        </Button>
      </div>
    </div>
  );
}
