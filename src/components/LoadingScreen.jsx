import React from 'react';

export function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <p className="text-gray-300 animate-pulse">Loading quiz…</p>
    </div>
  );
}
