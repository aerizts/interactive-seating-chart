'use client';

import dynamic from 'next/dynamic';

// Dynamically import the SeatingChart component with no SSR
const SeatingChart = dynamic(() => import('@/components/SeatingChart'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading seating chart...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          LEGO Seating Chart
        </h1>
        <SeatingChart />
      </div>
    </main>
  );
}
