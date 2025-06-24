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
    style={{
      position: "absolute",
      top: "-0.25rem",
      right: "-0.25rem",
      width: "0.5rem",
      height: "0.5rem",
      borderRadius: "9999px",
      backgroundColor: "#f00",
    }}
    aria-label="Items in cart"
  />
);

}
