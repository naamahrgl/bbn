// lib/products.ts


export type Product = {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  category: Record<string, string>;
  imageUrl: string;
  price: number;
  isFeatured: boolean;
};


const mockProducts = [
  {
    id: '1',
    name: { he: 'לחם כוסמת', en: 'Buckwheat Bread' },
    description: {
      he: 'לחם רך ועשיר מקמח כוסמת.',
      en: 'Soft and rich bread made from buckwheat flour.'
    },
    category: { he: 'לחמים', en: 'Breads' },
    imageUrl: '/Nicéphore_Niépce_Oldest_Photograph_1825.jpg',
    price: 24.0,
    isFeatured: true,
  },
  {
    id: '2',
    name: { he: 'פוקצ׳ה רוזמרין', en: 'Rosemary Focaccia' },
    description: {
      he: 'פוקצ׳ה עם שמן זית ורוזמרין טרי.',
      en: 'Focaccia with olive oil and fresh rosemary.'
    },
    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrl: '/Nicéphore_Niépce_Oldest_Photograph_1825.jpg',
    price: 28.0,
    isFeatured: true,
  },
    {
    id: '3',
    name: { he: 'קרקר 80%', en: '80% Cracker' },
    description: {
      he: 'קרקר מחמצת ממכר, מכיל 80% מחמצת',
      en: 'aDDICTIVE CRACKER'
    },
    category: { he: 'קרקרים', en: 'Crackers' },
    imageUrl: '/Nicéphore_Niépce_Oldest_Photograph_1825.jpg',
    price: 30.0,
    isFeatured: true,
  },
    {
    id: '4',
    name: { he: "בראוני", en: 'brownie' },
    description: {
      he: 'פוקצ׳ה עם שמן זית ורוזמרין טרי.',
      en: 'Focaccia with olive oil and fresh rosemary.'
    },
    category: { he: 'מתוקים', en: 'Sweets' },
    imageUrl: '/Nicéphore_Niépce_Oldest_Photograph_1825.jpg',
    price: 28.0,
    isFeatured: false,
  },
    {
    id: '5',
    name: { he: 'פוקצ׳ה ', en: ' Focaccia' },
    description: {
      he: 'פוקצ׳ה עם שמן זית ורוזמרין טרי.',
      en: 'Focaccia with olive oil and fresh rosemary.'
    },
    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrl: '/Nicéphore_Niépce_Oldest_Photograph_1825.jpg',
    price: 28.0,
    isFeatured: true,
  },
  // Add more products as needed
];

export function getProducts(lang: string) {
  return Promise.resolve(mockProducts);
}

export function getProductById(id: string) {
  const product = mockProducts.find(p => p.id === id);
  if (!product) throw new Error('Product not found');
  return Promise.resolve(product);
}

export function getFeaturedProducts(limit: number = 4) {
  const featured = mockProducts.filter(p => p.isFeatured).slice(0, limit);
  return Promise.resolve(featured);
}
