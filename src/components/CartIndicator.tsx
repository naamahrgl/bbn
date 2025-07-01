// CartIndicator.tsx
import { useEffect, useState } from "react";

export default function CartIndicator() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    try {
      const cart: Array<{ quantity?: number }> = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCount(total);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  if (count === 0) return null;

  return (
  <span
    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
    style={{ backgroundColor: '#6476ee' }}
    aria-label={`${count} items in cart`}
  />
  );
}
