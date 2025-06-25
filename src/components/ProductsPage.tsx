// src/components/ProductsPage.tsx

import React, { useEffect, useState } from 'react';
import { getProducts, getProductById, type Product } from '../lib/products';
import { addToCart } from '../lib/cart';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';

const translations = {
  he: {
    nav_Products: 'חזרה למוצרים',
    ourDailyBakes: 'מאפי היום שלנו',
    addToCart: 'הוסף לעגלה',
    noProducts: 'לא נמצאו מוצרים בקטגוריה זו.'
  },
  en: {
    nav_Products: 'Back to Products',
    ourDailyBakes: 'Our Daily Bakes',
    addToCart: 'Add to Cart',
    noProducts: 'No products found in this category.'
  }
};

const categoriesByLang = {
  he: ['הכל', 'לחמים', "פוקצ'ה ופיצה", 'קרקרים', 'מתוקים'],
  en: ['All', 'Breads', 'Focaccia & Pizza', 'Crackers', 'Sweets'],
};

type ProductsPageProps = {
  lang: 'he' | 'en';
};

export default function ProductsPage({ lang }: ProductsPageProps) {
  const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
  const productId = url?.searchParams.get('id') || '';
  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const categories = categoriesByLang[lang];

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

useEffect(() => {
  // getProducts כן עדיין אסינכרונית, אז זה תקין:
  getProducts(lang).then(products => {
    setAllProducts(products);
    if (!productId) {
      setSelectedProducts(products);
    }
  });

  // אבל getProductById היא סינכרונית, אז לא צריך then
  if (productId) {
    try {
      const found = getProductById(productId);
      setProduct(found);
    } catch {
      setProduct(null);
    }
  }
}, [lang, productId]);
;

  const filterProducts = (category: string) => {
    setActiveCategory(category);
    if (category === categories[0]) {
      setSelectedProducts(allProducts);
    } else {
      setSelectedProducts(allProducts.filter(p => p.category[lang] === category));
    }
  };

  if (productId && product) {
    return (
      <div className="px-4 py-8 sm:py-12">
        <a href={`/${lang}/products`} className="inline-flex items-center gap-2 text-brand-light hover:text-brand-dark mb-8">
          <ArrowLeft className="h-4 w-4" /> {t('nav_Products')}
        </a>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden border border-brand-primary">
            <img src={product.imageUrl} alt={product.name[lang]} className="w-full h-full object-cover" />
          </div>
          <div className="text-start">
            <p className="text-sm font-medium text-brand-secondary">{product.category[lang]}</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-2">{product.name[lang]}</h1>
            <p className="text-2xl sm:text-3xl font-bold text-brand-dark mt-4">₪{product.price.toFixed(2)}</p>
            <p className="mt-6 text-brand-light leading-relaxed whitespace-pre-line">{product.description[lang]}</p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center rounded-md border border-stone-300">
                <Button type="button" className="px-3 py-2" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button type="button" className="px-3 py-2" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button type="button" className="flex-1 bg-brand-secondary hover:bg-[#703c31] text-white px-4 py-2 rounded-md font-semibold"
                onClick={() => addToCart(product, quantity)}>
                {t('addToCart')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:py-12">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">{t('ourDailyBakes')}</h1>
      </div>
      <div className="flex justify-center mb-8 gap-2 flex-wrap">
        {categories.map((category: string) => (
          <Button
            key={category}
            type="button"
            className={`px-4 py-2 rounded border ${activeCategory === category ? 'bg-brand-secondary text-white' : 'border-stone-300 text-brand-dark hover:bg-stone-100'}`}
            onClick={() => filterProducts(category)}>
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {selectedProducts.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            <a href={`/${lang}/products?id=${product.id}`}>
              <img src={product.imageUrl} alt={product.name[lang]} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-brand-dark">{product.name[lang]}</h3>
                <p className="text-sm text-brand-light">₪{product.price.toFixed(2)}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
      {selectedProducts.length === 0 && (
        <p className="text-center text-stone-500 col-span-full">{t('noProducts')}</p>
      )}
    </div>
  );
}
