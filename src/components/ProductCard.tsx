// src/components/ProductCard.tsx

import React from 'react';
import { addToCart } from '../lib/cart';
import type { Product } from '../lib/products';

const translations = {
  he: {
    addToCart: 'הוספה לעגלה'
  },
  en: {
    addToCart: 'Add to Cart'
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
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <a href={`/${lang}/products?id=${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name[lang]}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-brand-dark">
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
          className="mt-2 w-full bg-brand-secondary hover:bg-[#703c31] text-white font-medium py-2 rounded"
        >
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
}
