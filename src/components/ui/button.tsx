// ui/button.tsx
import React from 'react';

export function Button({ children, onClick, type = 'button', className = '', disabled = false }: {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}