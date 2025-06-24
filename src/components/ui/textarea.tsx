// ui/textarea.tsx
import React from 'react';

export function Textarea({ id, value, onChange, placeholder }: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full rounded-md border border-stone-300 p-2 text-sm shadow-sm focus:border-brand-primary focus:ring-brand-primary"
      rows={4}
    />
  );
}
