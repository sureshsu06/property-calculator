'use client';

import { PropertyValuation } from '../components/property-valuation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <main className="container mx-auto max-w-4xl">
        <PropertyValuation />
      </main>
    </div>
  );
}