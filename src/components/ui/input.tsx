// ui/input.tsx
import React from 'react';

export function Input({ id, type = 'text', value, onChange, required = false }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-stone-300 rounded-md p-2"
    />
  );
}
