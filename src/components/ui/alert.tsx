// ui/alert.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

export function Alert({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
      <AlertCircle className="h-5 w-5 mt-1" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}