import React, { useState, useEffect } from 'react';
import { getCart, cartTotal } from '../lib/cart';
import { getProductById } from '../lib/products';

export type OrderSummaryProps = {
  lang: 'he' | 'en';
  deliveryMethod?: 'pickup' | 'delivery_near' | 'delivery_far';
  onCouponChange?: (coupon: { code: string; amount: number }) => void;
  onTotalsChange?: (totals: { finalTotal: number; deliveryFee: number }) => void;
};


const translations = {
  he: {
    your_order: 'ההזמנה שלך',
    qty: 'כמות',
    total: 'סה״כ',
    delivery_note: 'ייתכן שתתווסף עלות משלוח',
    delivery: 'משלוח',
    apply_coupon: 'החל קופון',
    coupon_placeholder: 'קוד קופון',
    invalid_coupon: 'קופון לא תקף',
  },
  en: {
    your_order: 'Your Order',
    qty: 'Qty',
    total: 'Total',
    delivery_note: 'Delivery fee may apply',
    delivery: 'Delivery',
    apply_coupon: 'Apply Coupon',
    coupon_placeholder: 'Coupon Code',
    invalid_coupon: 'Invalid coupon',
  }
};

export default function OrderSummary({ lang, deliveryMethod, onCouponChange, onTotalsChange }: OrderSummaryProps) {
  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const cart = getCart();
  const subtotal = cartTotal();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  let deliveryFee = 0;
  if (deliveryMethod === 'delivery_near') deliveryFee = 10;
  if (deliveryMethod === 'delivery_far') deliveryFee = 20;

const applyCoupon = async (silent: boolean = false) => {
  if (!couponCode.trim()) return;
  try {
    const res = await fetch(`/api/coupon?code=${encodeURIComponent(couponCode.trim())}`);
    const data = await res.json();

    if (!data.valid) {
      if (!silent) {
        if (data.reason === 'used up') {
          setCouponError(lang === 'he' ? 'הקופון כבר נוצל במלואו' : 'This coupon has been fully used');
        } else if (data.reason === 'expired') {
          setCouponError(lang === 'he' ? 'הקופון פג תוקף' : 'Coupon expired');
        } else {
          setCouponError(t('invalid_coupon'));
        }
      }
      setDiscount(0);
      return;
    }

    setCouponError('');
    const totalForDiscount = subtotal + deliveryFee;
if (data.percent > 0) {
  setDiscount((subtotal + deliveryFee) * (data.percent / 100));
} else if (data.type === 'credit') {
  setDiscount(Math.min(subtotal + deliveryFee, data.balance));
} else {
  setDiscount(Math.min(subtotal + deliveryFee, data.amount));
}

  } catch (e) {
    if (!silent) setCouponError(t('invalid_coupon'));
    setDiscount(0);
  }
};


  const finalTotal = subtotal + deliveryFee - discount;
  useEffect(() => {
  if (onCouponChange && couponCode && discount > 0) {
    onCouponChange({ code: couponCode, amount: discount });
  }
}, [couponCode, discount]);

useEffect(() => {
  if (onTotalsChange) {
    onTotalsChange({ finalTotal, deliveryFee });
  }
}, [finalTotal, deliveryFee]);
useEffect(() => {
  if (couponCode) {
    applyCoupon(true); // silent=true
  }
}, [deliveryMethod]);



  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border text-start">
      <h2 className="text-lg font-semibold mb-4 text-brand-dark">{t('your_order')}</h2>
      <div className="space-y-3">
        {cart.map(item => {
          const product = getProductById(item.id);
          return (
            <div key={item.id} className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 overflow-hidden rounded border">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name[lang]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{product.name[lang]}</p>
                  <p className="text-xs text-gray-500">{t('qty')}: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold">₪{(product.price * item.quantity).toFixed(2)}</p>
            </div>
          );
        })}
      </div>

      {deliveryFee > 0 && (
        <div className="mt-4 flex justify-between text-sm">
          <span>{t('delivery')}</span>
          <span>₪{deliveryFee.toFixed(2)}</span>
        </div>
      )}

      {discount > 0 && (
        <div className="mt-2 flex justify-between text-sm text-green-700">
          <span>Coupon</span>
          <span>-₪{discount.toFixed(2)}</span>
        </div>
      )}

      <div className="border-t mt-4 pt-4 flex justify-between text-sm font-bold">
        <span>{t('total')}</span>
        <span>₪{finalTotal.toFixed(2)}</span>
      </div>

      {!deliveryMethod && (
        <p className="text-xs text-stone-500 mt-2">{t('delivery_note')}</p>
      )}

      <div className="mt-6">
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm mb-2"
          placeholder={t('coupon_placeholder')}
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
        />
<button
  onClick={() => applyCoupon(false)}
  className="w-full bg-[var(--small-buttons)] hover:bg-[var(--small-buttons-hover)] text-white text-sm py-2 rounded"
>
  {t('apply_coupon')}
</button>

        {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
      </div>
    </div>
  );
}
