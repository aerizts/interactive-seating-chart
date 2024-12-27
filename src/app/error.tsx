'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  const handleReset = () => {
    try {
      reset();
    } catch (e) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          The application encountered an error. Please try again.
        </p>
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 p-4 bg-gray-100 rounded text-sm text-red-500 overflow-auto">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
}
