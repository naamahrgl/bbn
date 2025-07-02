import React, { useState, useEffect, useRef } from 'react';
import { getFeaturedProducts, type Product } from '../lib/products';
import ProductCard from './ProductCard';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="relative bg-brand-primary">
      <div className="container mx-auto px-4 py-16 sm:py-20 md:py-28">
        <div className="max-w-2xl text-center md:text-start">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--brand-text-title)' }}>
            {t('hero_title')}
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7" style={{ color: 'var(--brand-text-title)' }}>
            {t('hero_slogan')}
          </p>
          <div className="mt-6 sm:mt-10">
            <Button className="bg-[var(--big-buttons)] hover:bg-[var(--big-buttons-hover)] text-white shadow-lg">
              <a href={`/${lang}/products`} className="flex items-center gap-2">
                {t('shopAll')}
                <ArrowLeft className={`h-5 w-5 ${isRTL ? '' : 'rtl:hidden'}`} />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <img
          src="/photo.jpg"
          alt="Pastries"
          className="h-full w-full object-cover opacity-20"
        />
      </div>
    </div>
  );
}

function FeaturedProducts({ lang }: HomePageProps) {
  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (amount: number) => {
    const el = scrollRef.current;
    if (!el || !el.children.length) return;

    const firstChild = el.children[0] as HTMLElement;
    const cardWidth = firstChild.offsetWidth + 16; // includes gap
    el.scrollBy({ left: amount * cardWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const featured = await getFeaturedProducts(5);
      setProducts(featured);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-brand-background py-12 sm:py-16">
      <div className="container mx-auto px-4 relative">
        <h2
          className="text-center font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-6"
          style={{ color: 'var(--brand-text-title)' }}
        >
          {t('featuredFavorites')}
        </h2>

        <button
          onClick={() => scrollBy(-1)}
          className="cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:opacity-100 opacity-80"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:opacity-100 opacity-80"
        >
          <ChevronRight />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 px-2 snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[250px] flex-shrink-0 flex flex-col space-y-3"
                >
                  <div className="h-[250px] w-full rounded-lg bg-brand-primary animate-pulse" />
                  <div className="h-4 w-3/4 bg-brand-primary animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-brand-primary animate-pulse rounded" />
                </div>
              ))
            : products.map((product, i) => (
                <div
                  key={product.id + '-' + i}
                  className="flex-shrink-0 snap-start w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] max-w-[300px]"
                >
                  <ProductCard product={{ ...product, quantity: 1 }} lang={lang} />
                </div>
              ))}
        </div>
      </div>
    </div>
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
