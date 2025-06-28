import { useEffect, useState } from "react";

export default function CartIndicator() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cartRaw = localStorage.getItem("cart");
    if (!cartRaw) return;

    try {
      const cart: Array<{ quantity?: number }> = JSON.parse(cartRaw);
      const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setShow(total > 0);
    } catch {
      setShow(false);
    }
  }, []);

  if (!show) return null;


  return (
    <span
      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-black"
      aria-label="Items in cart"
    />
  );

}