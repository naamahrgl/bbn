// lib/products.ts

export type ProductId = 'buckwheat' | 'sourdough' | 'cinnamon' | 'cracker' | 'brownie' ;


export type Product = {
  id: ProductId;
  name: Record<string, string>;
  description: Record<string, string>;
  category: Record<string, string>;
  imageUrl: string;
  price: number;
  isFeatured: boolean;
};


export const PRODUCTS :Product[]= [
  {
    id: 'buckwheat',
    name: { he: 'לחם כוסמת', en: 'Buckwheat Bread' },
    description: {
      he: 'לחם רך ועשיר מקמח כוסמת.',
      en: 'Soft and rich bread made from buckwheat flour.'
    },
    category: { he: 'לחמים', en: 'Breads' },
    imageUrl: '/photo.jpg',
    price: 24.0,
    isFeatured: true,
  },
  {
    id: 'sourdough',
    name: { he: 'פוקצ׳ה רוזמרין', en: 'Rosemary Focaccia' },
    description: {
      he: 'פוקצ׳ה עם שמן זית ורוזמרין טרי.',
      en: 'Focaccia with olive oil and fresh rosemary.'
    },
    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrl: '/photo.jpg',
    price: 28.0,
    isFeatured: true,
  },
    {
    id: 'cracker',
    name: { he: 'קרקר 80%', en: '80% Cracker' },
    description: {
      he: 'קרקר מחמצת ממכר, מכיל 80% מחמצת',
      en: 'aDDICTIVE CRACKER'
    },
    category: { he: 'קרקרים', en: 'Crackers' },
    imageUrl: '/photo.jpg',
    price: 30.0,
    isFeatured: true,
  },
    {
    id: 'brownie',
    name: { he: "בראוני", en: 'brownie' },
    description: {
      he: 'פוקצ׳ה עם שמן זית ורוזמרין טרי.',
      en: 'Focaccia with olive oil and fresh rosemary.'
    },
    category: { he: 'מתוקים', en: 'Sweets' },
    imageUrl: '/photo.jpg',
    price: 28.0,
    isFeatured: false,
  },
    {
    id: 'cinnamon',
    name: { he: 'פוקצ׳ה ', en: ' Focaccia' },
    description: {
      he: 'פוקצ׳ה עם שמן זית ורוזמרין טרי.',
      en: 'Focaccia with olive oil and fresh rosemary.'
    },
    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrl: '/photo.jpg',
    price: 28.0,
    isFeatured: true,
  },
  // Add more products as needed
];



export function getProducts(lang: string) {
  return Promise.resolve(PRODUCTS);
}

export function getProductById(id: string) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) throw new Error('Product not found');
  return product;
}


export function getFeaturedProducts(limit: number = 4) {
  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, limit);
  return Promise.resolve(featured);
}
