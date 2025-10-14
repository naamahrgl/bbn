// lib/products.ts

export type ProductId = 'classic' | 'sandwich' | 'chedder-jalapino' | 'focaccia' | 'cracker' | 'brownie' | 'pizzas' | 'alfajores' | 'rolls' | 'breadcrumbs' |'tam';

type Tag = {
  key: 'new' | 'limited' | 'bestseller'; // You can add more
  until?: string; // Optional: for 'limited' items
};

export type Product = {
  id: ProductId;
  name: Record<string, string>;
  description: Record<string, string>;
  category: Record<string, string>;
    directions: Record<string, string>;
  ingredients: Record<string, string>;
nutrients?: Partial<Record<
  | 'cal' | 'fat' | 'carbs' | 'fiber' | 'protein' | 'iron'
  | 'calcium' | 'magnesium' | 'sodium' | 'sugar' | 'satFat' | 'transFat' | 'phosphorus' | 'cholesterol' | 'potasium',
  number
>>;
  imageUrls: string[]; 
  price: number;
  isFeatured: boolean;
   isAvailable: boolean;
  tags?: Tag[]; 
    variants?: {
    size: Record<string, string>;   // e.g. "single", "tray"
    price: number;
      multiplier?: number;         
  }[];
};


export const tagLabels: Record<'he' | 'en', Record<string, string>> = {
  he: {
    new: 'חדש!',
    limited: 'ספיישל',
    bestseller: 'רב מכר',
  },
  en: {
    new: 'New!',
    limited: 'Limited Edition',
    bestseller: 'Bestseller',
  },
};


export const PRODUCTS :Product[]= [
  {
    id: 'classic',
    name: { he: 'לחם קלאסי', en: 'Classic Bread' },
    description: {
      he: 'לחם עשיר, מזין ומשביע שמימש את עצמו',
      en: 'Rich and statisfying bread that live to its potential.'
    },
        directions: {
      he: 'להקפיא ביום המשלוח, או לשמור על השיש ליומיים/שלושה. להפשיר במיקרו/טוסטר/תנור.',
      en: 'freeze the day of delivery, or keep fresh on the counter for two/three days'
    },
        ingredients: {
      he: 'מחמצת, קמח דורה, קמח טפיוקה, קמח דוחן, קמח כוסמת, קמח תפוחי אדמה, קליפות פסיליום, סילאן, מלח.',
      en: 'Sourdogh, sorghum flour, tapioca flour, millet flour, buckwheat flour, potato flour, psylium husks, date syrup, salt.'
    },
    nutrients: {cal : 159.180000, carbs : 34.600000, sugar : 1.420000, protein : 2.910000, fat : 1.080000, transFat : 0.140000, satFat : 0.100000, sodium : 377.000000, fiber : 5.150000, iron : 0.890000, magnesium : 6.790000, phosphorus : 16.980000, calcium : 2.050000},
    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
      '/products/bread1.webp',
      '/products/bread2.mp4',
      '/products/bread3.webp',
            '/products/bread4.webp'
    ],    
    price: 35.0,
    isFeatured: true,
      isAvailable: true,
  },
      {
    id: 'tam',
    name: { he: 'לחם תם', en: 'Soft Bread' },
    description: {
      he: 'לחם סנדביץ׳ בשם חדש! \nלחם רך ומנחם, טעים עם הכל ובא להרים.',
      en: 'Light, soft and comforting bread, that can carry anything.\n Formerly called Sandwich Bread - in hebrew its now called Tam Bread - meaning ingenuous/innocent.'
    },
            directions: {
      he: 'יש להקפיא ביום המשלוח, או לשמור טרי על השיש במשך יומיים/שלושה. יש להפשיר במיקרוגל/טוסטר/תנור.',
      en: 'freeze the day of delivery, or keep fresh on the counter for two/three days. Defrost in microwave/toaster/oven.'
    },
        ingredients: {
      he: 'מחמצת, קמח דורה, קמח טפיוקה, קמח דוחן, קמח תפוחי אדמה, קליפות פסיליום, מייפל, מלח.',
      en: 'Sourdogh, sorghum flour, tapioca flour, millet flour, potato flour, psylium husks, maple syrup, salt.'
    },
    nutrients: {cal : 173.620000, carbs : 38.940000, sugar : 2.950000, protein : 2.560000, fat : 1.020000, transFat : 0.130000, satFat : 0.090000, sodium : 343.590000, fiber : 4.610000, iron : 0.820000, magnesium : 10.130000, phosphorus : 25.330000, calcium : 4.240000},
    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
            '/products/sand3.webp',
      '/products/sndw.webp',
      '/products/sand2.webp',
    ],   
    price: 35.0,
    isFeatured: true,
      isAvailable: true,

  },
  {
    id: 'sandwich',
    name: { he: 'לחם סנדביץ׳', en: 'Sandwich Bread' },
    description: {
      he: 'לחם רך ומנחם, טעים עם הכל ובא להרים',
      en: 'Light, soft and comforting bread, that can carry anything'
    },
            directions: {
      he: 'יש להקפיא ביום המשלוח, או לשמור טרי על השיש במשך יומיים/שלושה. יש להפשיר במיקרוגל/טוסטר/תנור.',
      en: 'freeze the day of delivery, or keep fresh on the counter for two/three days. Defrost in microwave/toaster/oven.'
    },
        ingredients: {
      he: 'מחמצת, קמח דורה, קמח טפיוקה, קמח דוחן, קמח תפוחי אדמה, קליפות פסיליום, מייפל, מלח.',
      en: 'Sourdogh, sorghum flour, tapioca flour, millet flour, potato flour, psylium husks, maple syrup, salt.'
    },
    nutrients: {cal : 173.620000, carbs : 38.940000, sugar : 2.950000, protein : 2.560000, fat : 1.020000, transFat : 0.130000, satFat : 0.090000, sodium : 343.590000, fiber : 4.610000, iron : 0.820000, magnesium : 10.130000, phosphorus : 25.330000, calcium : 4.240000},
    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
            '/products/sand3.webp',
      '/products/sndw.webp',
      '/products/sand2.webp',
    ],   
    price: 35.0,
    isFeatured: false,
      isAvailable: false,

  },
    {
    id: 'cracker',
    name: { he: 'קרקר', en: 'Cracker' },
    description: {
      he: 'דקיק, פריך, ואהוב על כולם - קרקר ממכר שקשה להפסיק לאכול.',
      en: 'Thin and crispy that everyone loves - addictive cracker that you cant stop eating'
    },
            directions: {
      he: 'נשמר טרי עד חמישה ימים',
      en: 'Keeps fresh for up to five days'
    },
        ingredients: {
      he: 'מחמצת, חמאה, קמח טפיוקה, קליפות פסיליום, מלח.',
      en: 'Sourdogh, butter, tapioca flour, psylium husks, salt.'
    },
        nutrients: {cal : 383.970000, carbs : 56.010000, sugar : 0.740000, protein : 6.790000, fat : 13.760000, transFat : 0.690000, satFat : 7.020000, sodium : 603.490000, fiber : 6.070000, iron : 2.330000, calcium : 34.670000, cholesterol : 31.150000},

    category: { he: 'קרקרים', en: 'Crackers' },
    imageUrls: [
      '/products/cracker1.webp',
      '/products/cracker2.mp4'
        ],   
        price: 30.0,
    isFeatured: true,
      isAvailable: true,
  },
    {
    id: 'brownie',
    name: { he: "בראוני", en: 'Brownie' },
    description: {
      he: 'נימוח, עשיר ומנחם - אין עליו! מגיע בתבנית אישית',
      en: 'Rich and comforting personal brownie, that you can never get enough of'
    },
            directions: {
      he: 'ניתן לאחסן במקרר עד ארבעה ימים',
      en: 'Can be stored in the fridge for up to four days'
    },
        ingredients: {
      he: 'שוקולד 60%, סוכר קנים, ביצים, חמאה, קמח שקדים, קקאו.',
      en: 'Chocolate 60%, cane sugar, eggs, butter, almond meal, cocoa.'
    },
        nutrients: {cal : 475.320000, carbs : 37.850000, sugar : 34.130000, protein : 6.680000, fat : 32.950000, transFat : 0.500000, satFat : 16.480000, sodium : 23.710000, fiber : 1.790000, cholesterol : 110.000000, potasium : 123.210000},
            category: { he: 'מתוקים', en: 'Sweets' },
    imageUrls: [
      '/products/brow1.webp'
    ],   
        price: 20.0,
    isFeatured: true,
          isAvailable: true,
          variants: [{size: {he: 'אישי', en: "single"}, price: 20}, {size: {he: 'עוגה 20*30', en: "Tray 20*30"}, price: 110, multiplier: 8}]

  },
    {
    id: 'focaccia',
    name: { he: 'פוקצ׳ה', en: 'Focaccia' },
    description: {
      he: 'מפנקת ומנחמת - היא רכה מפנים ופריכה מבחוץ',
      en: 'Indulgent and comforting - this focaccia is both soft and crunchy'
    },
            directions: {
      he: 'הקפיאו ביום המשלוח, או אכלו טרי!',
      en: 'freeze the day of delivery, or eat fresh!'
    },
        ingredients: {
      he: 'מחמצת, קמח טף, קמח דורה, קמח תפוחי אדמה, שמן זית, קליפות פסיליום, סילאן, מלח.',
      en: 'Sourdogh, teff flour, sorghum flour, potato flour, olive oil, psylium husks, date syrup, salt.'
    },
        nutrients: {cal : 198.320000, carbs : 31.110000, sugar : 1.880000, protein : 3.390000, fat : 6.780000, transFat : 0.180000, satFat : 1.030000, sodium : 383.170000, fiber : 4.340000, iron : 1.680000, magnesium : 28.850000, calcium : 31.350000},

    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrls: [
      '/products/foca1.webp',
      '/products/fo2.mp4'
        ],   
        price: 25.0,
    isFeatured: true,
          isAvailable: true,
                    variants: [{size: {he: 'אישי', en: "single"}, price: 25}, {size: {he: 'גדול', en: "Double"}, price: 50, multiplier: 2}]


  },
    {
    id: 'chedder-jalapino',
    name: { he: 'לחם צ׳דר-חלפיניו', en: 'Chedder-Jalapino Bread' },
    description: {
      he: 'אומאמי וחרפרף - לחם פשוט מטורף! לחם רך שעובד עם כל דבר מלוח אבל לא צריך כלום',
      en: 'Umami and savoury - simply insane bread! Soft bread that works with anything, and needs nothing'
    },
            directions: {
      he: 'יש להקפיא ביום המשלוח, או לשמור טרי על השיש במשך יומיים/שלושה. יש להפשיר במיקרוגל/טוסטר/תנור.',
      en: 'freeze the day of delivery, or keep fresh on the counter for two/three days. Defrost in microwave/toaster/oven.'
    },
        ingredients: {
      he: 'מחמצת, קמח כוסמת, קמח דורה, קמח תפוחי אדמה, גבינת צדר לבנה, פלפל חלפיניו כבוש, קליפות פסיליום, סילאן, מלח.',
      en: 'Sourdogh, buckwheat flour, sorghum flour, potato flour, white chedder cheese, pickled jalapino pepper, psylium husks, date syrup, salt.'
    },
        nutrients: {cal : 166.850000, carbs : 28.100000, sugar : 0.210000, protein : 5.320000, fat : 3.380000, transFat : 0.150000, satFat : 1.610000, sodium : 48.560000, fiber : 4.590000, iron : 0.780000, calcium : 1.810000, cholesterol : 7.290000, potasium : 6.810000},

    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
      '/products/ched1.webp',
      '/products/ched2.mp4'
    ],   
        price: 50.0,
    isFeatured: false,
      isAvailable: false,
      tags: [{ key: 'limited'}]
  },
      {
    id: 'pizzas',
    name: { he: 'תחתיות פיצה', en: 'Pizza Bases' },
    description: {
      he: 'זוג תחתיות פיצה קפואות -  טעימות וזהובות שלא עושות בושות',
      en: 'Flavourful and golden pair of frozen pizza bases that do you justice'
    },
            directions: {
      he: 'הוסיפו את התוספות האהובות עליכם והכניסו לתנור/טוסטר למשך חמש דקות.',
      en: 'Just add your favourite toppings and pop it in the oven/toaster-over for five minutes'
    },
        ingredients: {
      he: 'מחמצת, קמח אורז מלא, קמח דורה, קמח כוסמת, קמח טפיוקה, קמח תפוחי אדמה, שמן זית, קליפות פסיליום, סילאן, מלח.',
      en: 'Sourdogh, sorghum flour, whole rice flour, buckwheat flour, tapioca flour,  potato flour, olive oil, psylium husks, date syrup, salt.'
    },
        nutrients: {cal : 193.320000, carbs : 38.790000, sugar : 1.960000, protein : 3.150000, fat : 3.210000, transFat : 0.180000, satFat : 0.540000, sodium : 385.590000, fiber : 4.760000, iron : 0.500000,  calcium : 1.900000},

    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrls: [
      '/products/piz1.webp',
      '/products/piz2.webp'
    ],   
        price: 25.0,
    isFeatured: true,
          isAvailable: true,

  },
        {
    id: 'alfajores',
    name: { he: 'אלפחורס', en: 'Alfajores' },
    description: {
      he: '4 עוגיות סנדביץ׳ נימוחות מפוצצות בריבת חלב',
      en: '4 Delicate cookie sandwitch filled with heaps on dulce de leche. '
    },
            directions: {
      he: 'ישמר טרי עד 5 ימים',
      en: 'Keeps fresh for up to 5 days'
    },
        ingredients: {
      he: 'קמח אורז לבן, קמח דורה, קמח שקדים, קמח טפיוקה, חמאה, ביצים, ריבת חלב, קוקס טחון, קליפות פסיליום, וניל',
      en: 'Sorghum flour, white rice flour, almond meal, tapioca flour,  butter, eggs, psylium husks, dulce e leche, cocunut flakes, vanilla.'
    },
        nutrients: {cal : 347.730000, carbs : 59.070000, sugar : 43.710000, protein : 6.380000, fat : 9.690000, transFat : 0.260000, satFat : 4.830000, sodium : 163.120000, fiber : 1.360000, iron : 0.110000, cholesterol : 36.870000, potasium : 35.670000},

            category: { he: 'מתוקים', en: 'Sweets' },
    imageUrls: [
            '/products/alf1.webp',
      '/products/alf2.webp',
      '/products/alf3.webp'
    ],   
        price: 30.0,
    isFeatured: true,
          isAvailable: true

  },
    {
    id: 'rolls',
    name: { he: 'מארז לחמניות', en: '5 Rolls' },
    description: {
      he: 'חמש לחמניות מתקתקות ובהירות, טעימות עם הכל',
      en: 'Five light and sweet rolls, that goes well with everything'
    },
            directions: {
      he: 'יש להקפיא ביום המשלוח, או לשמור טרי על השיש במשך יומיים. אפשר להפשיר במיקרוגל/טוסטר/תנור.',
      en: 'freeze the day of delivery, or keep fresh on the counter for two/three days. Defrost in microwave/toaster/oven.'
    },
        ingredients: {
      he: 'מחמצת, קמח דורה, קמח טפיוקה, קמח דוחן, קמח תפוחי אדמה, קליפות פסיליום, מייפל, מלח.',
      en: 'Sourdogh, sorghum flour, tapioca flour, millet flour, potato flour, psylium husks, maple syrup, salt.'
    },
    nutrients: {cal : 173.620000, carbs : 38.940000, sugar : 2.950000, protein : 2.560000, fat : 1.020000, transFat : 0.130000, satFat : 0.090000, sodium : 343.590000, fiber : 4.610000, iron : 0.820000, magnesium : 10.130000, phosphorus : 25.330000, calcium : 4.240000},
    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
            '/products/rolls1.webp',
      '/products/rolls2.webp',
    ],   
    price: 35.0,
    isFeatured: true,
      isAvailable: true,
      tags: [{ key: 'new' }]

  },
      {
    id: 'breadcrumbs',
    name: { he: 'פירורי לחם', en: 'Bread Crumbs' },
    description: {
      he: 'פירורי לחם אמיתיים שיקפיצו כל מנה! טעימים ובריאים - עשויים מהלחמים המעולים שלי (250 גרם)',
      en: 'Real bread crumbs that will elevate your kitchen! Yummy and Healthy - made from my great bread.'
    },
            directions: {
      he: 'ישמרו סביבות שלושה חודשים במקום קריר ויבש',
      en: 'keep for around three months in a cool and dry place'
    },
        ingredients: {
      he: 'מחמצת, קמח דורה, קמח טפיוקה, קמח דוחן, קמח תפוחי אדמה, קליפות פסיליום, מייפל, מלח.',
      en: 'Sourdogh, sorghum flour, tapioca flour, millet flour, potato flour, psylium husks, maple syrup, salt.'
    },
nutrients: {
  cal: 332.800000,
  carbs: 73.540000,
  sugar: 4.380000,
  protein: 5.480000,
  fat: 2.100000,
  transFat: 0.270000,
  satFat: 0.190000,
  sodium: 720.600000,
  fiber: 9.760000,
  iron: 1.710000,
  magnesium: 16.920000,
  phosphorus: 42.320000,
  calcium: 6.300000
},    
category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
            '/products/crumb2.webp',

            '/products/crumbs1.webp',
    ],   
    price: 25.0,
    isFeatured: true,
      isAvailable: true,
      tags: [{ key: 'new' }]

  },

];




export function getProducts(lang: string) {
  return Promise.resolve(PRODUCTS);
}
export function getProductById(id: string, size?: string) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) throw new Error(`Product not found: ${id}`);

  if (size && Array.isArray(product.variants)) {
    const variant = product.variants.find(v =>
      Object.values(v.size || {}).some(s => s === size)
    );

    if (variant) {
      return { ...product, ...variant };
    }
  }

  return product;
}





export function getFeaturedProducts(limit: number = 20) {
  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, limit);
  return Promise.resolve(featured);
}
