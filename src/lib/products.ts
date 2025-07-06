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
  | 'calcium' | 'magnesium' | 'sodium' | 'sugar' | 'satFat' | 'transFat' | 'phosphorus',
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
    nutrients: { cal : 158.230000, fat : 1.170000, sodium : 356.690000, carbs : 33.620000, sugar : 1.580000, protein : 3.140000, fiber : 5.040000, iron : 0.960000, transFat : 0.150000, satFat : 0.110000, magnesium : 7.370000, phosphorus : 18.430000, calcium : 0.000000},
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
    category: { he: 'קרקרים', en: 'Crackers' },
    imageUrls: [
      '/photo.jpg',
      '/photo.jpg',
      '/photo.jpg'
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
    category: { he: 'מתוקים', en: 'Sweets' },
    imageUrls: [
      '/photo.jpg',
      '/photo.jpg',
      '/photo.jpg'
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
    category: { he: "פוקצ'ה ופיצה", en: 'Focaccia & Pizza' },
    imageUrls: [
      '/photo.jpg',
      '/photo.jpg',
      '/photo.jpg'
    ],   
        price: 25.0,
    isFeatured: true,
  },
    {
    id: 'chedder-jalapino',
    name: { he: 'פוקצ׳ה ', en: 'Focaccia' },
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
    category: { he: 'לחמים', en: 'Breads' },
    imageUrls: [
      '/photo.jpg',
      '/photo.jpg',
      '/photo.jpg'
    ],   
        price: 45.0,
    isFeatured: true,
  },
      {
    id: 'pizzas',
    name: { he: 'פוקצ׳ה ', en: 'Pizza Bases' },
    description: {
      he: 'זוג תחתיות פיצה קפואות -  טעימות וזהובות שלא עושות בושות',
      en: 'Flavourful and golden pair of frozen pizza bases that do you justice'
    },
            directions: {
      he: '',
      en: 'Just add your favourite toppings and pop it in the oven/toaster-over for five minutes'
    },
        ingredients: {
      he: 'פשוט הוסיפו את התוספות האהובות עליכם והכניסו לתנור/טוסטר למשך חמש דקות.',
      en: 'Sourdogh, sorghum flour, whole rice flour, buckwheat flour, tapioca flour,  potato flour, psylium husks, date syrup, salt.'
    },
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


export function getFeaturedProducts(limit: number = 4) {
  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, limit);
  return Promise.resolve(featured);
}
