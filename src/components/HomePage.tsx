import React, { useState, useEffect, useRef } from 'react';
import { getFeaturedProducts, type Product } from '../lib/products';
import ProductCard from './ProductCard';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const translations = {
  he: {
    hero_title: 'לחם נעמה',
    hero_slogan: 'לחמי ומאפי מחמצת ללא גלוטן, טבעיים וטעימים',
    shopAll: 'לצפייה בכל המוצרים',
    featuredFavorites: 'מומלצים במיוחד'
  },
  en: {
    hero_title: 'Bread by Naama',
    hero_slogan: 'Sourdough gluten-free breads & pastries — all natural, all delicious',
    shopAll: 'Shop All Products',
    featuredFavorites: 'Featured Favorites'
  }
};

type HomePageProps = {
  lang: 'he' | 'en';
};

function Hero({ lang }: HomePageProps) {
  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const isRTL = lang === 'he';

  return (
<div className="relative bg-brand-primary overflow-hidden min-h-[500px]">
  <div className="container mx-auto px-4 py-16 sm:py-20 md:py-28 relative z-10">
    <div className="max-w-2xl text-center md:text-start">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--brand-text-title)]">
        {t('hero_title')}
      </h1>
      <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 text-[var(--brand-text-title)]">
        {t('hero_slogan')}
      </p>
      <div className="mt-6 sm:mt-10">
        <Button className="bg-[var(--big-buttons)] hover:bg-[var(--big-buttons-hover)] text-white shadow-lg">
          <a href={`/${lang}/products`} className="flex items-center gap-2">
            {t('shopAll')}
            {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </a>
        </Button>
      </div>
    </div>
  </div>
  {/* תמונה רקע + גרדיאנט */}
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <img
      src="/bread.jpg"
      alt="Bread by Naama"
      className="h-full w-full object-cover opacity-20"
    />
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[var(--brand-background)]" />
  </div>
</div>

  );
}


function FeaturedProducts({ lang }: HomePageProps) {
  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const featured = await getFeaturedProducts();
      setProducts(featured);
    };
    fetchProducts();
  }, []);

  const scrollByCard = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('div[data-card]') as HTMLElement;
    if (!card) return;
    const scrollAmount = card.offsetWidth + 16;
    el.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="bg-brand-background py-10">
      <div className="mx-auto px-4" style={{ maxWidth: `${products.length * 316}px` }}> {/* 300px card + 16px gap */}
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 text-[var(--brand-text-title)]">
          {t('featuredFavorites')}
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scrollByCard('left')}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:opacity-100 opacity-80"
          >
            <ChevronLeft />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scrollByCard('right')}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:opacity-100 opacity-80"
          >
            <ChevronRight />
          </button>

          {/* Carousel */}
          <div
            ref={scrollRef}
            className="scroll-smooth overflow-x-auto flex gap-4 snap-x snap-mandatory px-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                data-card
                className="flex-shrink-0 snap-start w-[300px]"
              >
                <ProductCard product={{ ...product, quantity: 1 }} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



export default function HomePage({ lang }: HomePageProps) {
  return (
    <>
      <Hero lang={lang} />
      <FeaturedProducts lang={lang} />
    </>
  );
}
