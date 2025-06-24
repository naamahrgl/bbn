// ui/skeleton.tsx
import React from 'react';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-stone-200 ${className}`} />
  );
}
