import type { Product } from "../lib/products";

export function NutrientsTable({ data, lang }: { data: Product['nutrients'], lang: 'he' | 'en' }) {
  if (!data) return null;

  const labels = {
    cal: lang === 'he' ? 'קלוריות' : 'Calories',
    fat: lang === 'he' ? 'שומן (גרם)' : 'Fat (g)',
    satFat: lang === 'he' ? 'שומן רווי (גרם)' : 'Sat. Fat (g)',
    transFat: lang === 'he' ? ' שומן טראנס (גרם) - פחות מ' : '  Trans Fat (g) - less than',
    carbs: lang === 'he' ? 'פחמימות (גרם)' : 'Carbs (g)',
    fiber: lang === 'he' ? 'סיבים תזונתיים (גרם)' : 'Fiber (g)',
    protein: lang === 'he' ? 'חלבון (גרם)' : 'Protein (g)',
    iron: lang === 'he' ? 'ברזל (מ״ג)' : 'Iron (mg)',
    calcium: lang === 'he' ? 'סידן (מ״ג)' : 'Calcium (mg)',
    magnesium: lang === 'he' ? 'מגנזיום (מ״ג)' : 'Magnesium (mg)',
    sodium: lang === 'he' ? 'נתרן (מ״ג)' : 'Sodium (mg)',
    sugar: lang === 'he' ? 'סוכרים (גרם)' : 'Sugar (g)',
    phosphorus: lang === 'he' ? 'זרחן (מ״ג)' : 'Phosphorus (mg)',
    cholesterol: lang === 'he' ? 'כולסטרול (מ״ג)' : 'Cholesterol (mg)',
    potasium: lang === 'he' ? 'אשלגן (מ״ג)' : 'Potasium (mg)'
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-brand-dark">
        {lang === 'he' ? 'ערכים תזונתיים (ל־100 גרם)' : 'Nutritional Info (per 100g)'}
      </h4>
      <table className="w-full mt-2 text-sm border-t border-gray-300">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200">
              <td className="py-1 pr-4 text-brand-dark">{labels[key as keyof typeof labels]}</td>
              <td className="py-1 text-brand-light">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
