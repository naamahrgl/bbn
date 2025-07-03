// src/components/ProductsPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import { getProducts, getProductById, type Product } from '../lib/products';
import { addToCart } from '../lib/cart';
import { ArrowLeft, Plus, Minus, ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Alert } from './ui/alert';

const translations = {
  he: {
    nav_Products: 'חזרה למוצרים',
    ourDailyBakes: 'מאפי היום שלנו',
    prod_des: ' כל המוצרים נאפים כל בוקר ומגיעים אליכם טריים',
    addToCart: 'הוסף לעגלה',
    noProducts: 'לא נמצאו מוצרים בקטגוריה זו.'
  },
  en: {
    nav_Products: 'Back to Products',
    ourDailyBakes: 'Our Daily Bakes',
        prod_des: 'All product are baked each morning and delivered fresh',
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
  const scrollRef = useRef<HTMLDivElement>(null);


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
<a href={`/${lang}/products`}>
<Button
  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--small-buttons)] hover:bg-[var(--small-buttons-hover)] text-white font-medium py-2 rounded mb-6">
  {lang !== 'he' ? (
    <ArrowLeft className="h-4 w-4" />
  ) : (
    <ArrowRight className="h-4 w-4" />
  )}
  {t('nav_Products')}
</Button>

</a>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden border border-brand-primary">



<div className="relative w-full overflow-hidden rounded-lg border border-brand-primary">
  <div
    ref={scrollRef}
    className="flex overflow-x-auto scroll-smooth no-scrollbar"
    style={{ scrollSnapType: 'x mandatory' }}
  >
    {product.imageUrls.map((url, index) => (
      <img
        key={index}
        src={url}
        alt={`${product.name[lang]} ${index + 1}`}
        className="w-full h-[300px] object-cover flex-shrink-0 "
        style={{ minWidth: '100%', scrollSnapAlign: 'start' }}
      />
    ))}
  </div>

  {product.imageUrls.length > 1 && (
    <>
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
        className="cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-1 rounded-full shadow"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
        className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-1 rounded-full shadow"
      >
        <ChevronLeft className="rotate-180 h-5 w-5" />
      </button>
    </>
  )}
</div>





          </div>
          <div className="text-start">
            <p className="text-sm font-medium text-brand-secondary">{product.category[lang]}</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-2">{product.name[lang]}</h1>
            <p className="text-2xl sm:text-3xl font-bold text-brand-dark mt-4">₪{product.price.toFixed(2)}</p>
            <p className="mt-6 text-brand-light leading-relaxed whitespace-pre-line">{product.description[lang]}</p>

<div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
  {/* Quantity Selector */}
  <div className="inline-flex items-center rounded-md border border-stone-300 overflow-hidden self-start">
    <Button
      type="button"
      className="px-3 py-2 rounded-none"
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
    >
      <Minus className="h-4 w-4" />
    </Button>
    <span className="w-12 text-center font-medium">{quantity}</span>
    <Button
      type="button"
      className="px-3 py-2 rounded-none"
      onClick={() => setQuantity(quantity + 1)}
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>

  {/* Add to cart button */}
  <Button
    type="button"
    className="w-full sm:w-auto bg-[var(--big-buttons)] hover:bg-[var(--big-buttons-hover)] text-white font-medium py-2 rounded"
    onClick={() => {
      addToCart(product, quantity);
      alert(lang === 'he' ? 'המוצר נוסף לעגלה' : 'Item added to cart');
    }}
  >
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
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight " style= {{ color: 'var(--brand-text-title)' }}>{t('ourDailyBakes')}</h1>
        <h3 className="font-serif text-s sm:text-s tracking-tight " style= {{ color: 'var(--brand-text-title)' }}>{t('prod_des')}</h3>
      </div>
      <div className="flex justify-center mb-8 gap-2 flex-wrap">
        {categories.map((category: string) => (
          <Button
            key={category}
            type="button"
            className={`px-4 py-2 bg-[var(--small-buttons)] rounded border ${activeCategory === category ? 'bg-[var(--small-buttons)] text-white' : 'border-stone-300 text-[var(--brand-dark)] hover:bg-[var(--small-buttons-hover)]'}` }
            onClick={() => filterProducts(category)}>
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
{selectedProducts.map(product => (
  <div key={product.id} className=" rounded-lg overflow-hidden flex flex-col justify-between bg-[var(--brand-lighter)] shadow">
    <a href={`/${lang}/products?id=${product.id}`}>
      <img src={product.imageUrls[0]} alt={product.name[lang]} className="h-48 w-full object-cover" />
      <div className="p-4 ">
        <h3 className="text-lg font-semibold text-brand-dark">{product.name[lang]}</h3>
        <p className="text-sm text-brand-light">₪{product.price.toFixed(2)}</p>
      </div>
    </a>
    <div className="px-4 pb-4 mt-auto">
      <Button
        type="button"
        className="w-full bg-[var(--big-buttons)] hover:bg-[var(--big-buttons-hover)] text-white font-medium py-2 rounded"
        onClick={() => {
          addToCart(product, 1);
          alert(lang === 'he' ? 'המוצר נוסף לעגלה' : 'Item added to cart');
        }}
      >
        {t('addToCart')}
      </Button>
    </div>
  </div>
))}

      </div>
      {selectedProducts.length === 0 && (
        <p className="text-center text-stone-500 col-span-full">{t('noProducts')}</p>
      )}
    </div>
  );
}
