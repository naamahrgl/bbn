// lib/products.ts

export type ProductId = 'classic' | 'sandwich' | 'chedder-jalapino' | 'focaccia' | 'cracker' | 'brownie' | 'pizzas';


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
      he: ' להקפיא ביום המשלוח, או לשמור על השיש ליומיים/שלושה. להפשיר במיקרו/טוסטר/תנור.',
      en: 'freeze the day of delivery, or keep fresh on the counter for two/three days'
    },
        ingredients: {
      he: 'מחמצת, קמח דורה, קמח טפיוקה, קמח דוחן, קמח כוסמת, קמח תפוחי אדמה, קליפות פסיליום, סילאן, מלח.',
      en: 'Sourdogh, sorghum flour, tapioca flour, millet flour, buckwheat flour, potato flour, psylium husks, date syrup, salt.'
    },
    nutrients: {cal : 160.350000, fat : 1.080000, sodium : 377.470000, carbs : 34.850000, sugar : 1.600000, protein : 2.910000, fiber : 5.150000, iron : 0.890000, transFat : 0.140000, satFat : 0.100000, magnesium : 6.790000, phosphorus : 16.980000},
    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
      '/products/bread1.webp',
      '/products/bread2.mp4',
      '/products/bread3.webp',
            '/products/bread4.webp'
    ],    
    price: 35.0,
    isFeatured: true,
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
    nutrients: {},
    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
      '/photo.jpg',
      '/photo.jpg',
      '/photo.jpg'
    ],   
    price: 35.0,
    isFeatured: true,
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
        nutrients: {cal : 383.090000, fat : 13.690000, sodium : 801.120000, carbs : 55.950000, sugar : 1.360000, protein : 6.750000, fiber : 6.040000, iron : 2.320000, transFat : 0.690000, satFat : 6.990000, cholesterol : 30.990000},

    category: { he: 'קרקרים', en: 'Crackers' },
    imageUrls: [
      '/products/cracker1.webp',
      '/products/cracker2.mp4'
        ],   
        price: 30.0,
    isFeatured: true,
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
        nutrients: {cal : 475.320000, fat : 32.950000, sodium : 23.710000, carbs : 37.850000, sugar : 34.130000, protein : 6.680000, fiber : 1.790000, iron : 0.000000, transFat : 0.500000, satFat : 16.480000, phosphorus : 0.000000, cholesterol : 110.000000, potasium : 123.210000},
            category: { he: 'מתוקים', en: 'Sweets' },
    imageUrls: [
      '/products/brow1.webp'
    ],   
        price: 20.0,
    isFeatured: false,
  },
    {
    id: 'focaccia',
    name: { he: 'פוקצ׳ה ', en: 'Focaccia' },
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
        nutrients: {cal : 198.320000, fat : 6.780000, sodium : 383.290000, carbs : 31.110000, sugar : 2.200000, protein : 3.390000, fiber : 4.340000, iron : 1.680000, transFat : 0.180000, satFat : 1.030000, magnesium : 28.850000, calcium : 28.850000},

    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrls: [
      '/products/fo1.webp',
      '/products/fo2.mp4'
        ],   
        price: 25.0,
    isFeatured: true,
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
        nutrients: {cal : 166.850000, fat : 3.380000, sodium : 49.990000, carbs : 28.100000, sugar : 0.510000, protein : 5.300000, fiber : 4.590000, iron : 0.780000, transFat : 0.150000, satFat : 1.610000, cholesterol : 7.290000, potasium : 6.810000},

    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
      '/products/ched1.webp',
      '/products/ched2.mp4'
    ],   
        price: 50.0,
    isFeatured: true,
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
        nutrients: {cal : 194.220000, fat : 3.180000, sodium : 570.900000, carbs : 39.050000, sugar : 2.090000, protein : 3.120000, fiber : 4.710000, iron : 0.490000, transFat : 0.170000, satFat : 0.530000},

    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrls: [
      '/photo.jpg',
      '/photo.jpg',
      '/photo.jpg'
    ],   
        price: 25.0,
    isFeatured: true,
  },
];



export function getProducts(lang: string) {
  return Promise.resolve(PRODUCTS);
}

export function getProductById(id: string) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) throw new Error('Product not found');
  return product;
}


export function getFeaturedProducts(limit: number = 20) {
  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, limit);
  return Promise.resolve(featured);
}
