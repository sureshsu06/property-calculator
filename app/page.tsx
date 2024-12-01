// app/page.tsx
'use client';

import { PropertyValuation } from '@/components/property-valuation';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <PropertyValuation />
    </main>
  );
}