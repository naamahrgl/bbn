// src/components/ProductCard.tsx

import React from 'react';
import { addToCart } from '../lib/cart';
import type { Product } from '../lib/products';


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
    alert(lang === 'he' ? 'המוצר נוסף לעגלה' : 'Item added to cart')

  };

  return (
    <div className="bg-[var(--brand-lighter)] rounded-lg shadow-sm border-color  overflow-hidden">
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
          <p className="text-sm text-brand-light mt-1">
            ₪{product.price.toFixed(2)}
          </p>
        </div>
      </a>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-[var(--small-buttons)] hover:bg-[var(--small-buttons-hover)] text-white font-medium py-2 rounded">
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
}
