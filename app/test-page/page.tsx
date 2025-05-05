"use client";

import React from 'react';
import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-dark-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a simple test page to verify that imports are working correctly.</p>
      
      <div className="p-4 bg-dark-800 rounded-md mb-4">
        <pre className="text-sm">
          {`Next.js is running correctly if you can see this page.`}
        </pre>
      </div>
      
      <Link href="/" className="text-primary-400 hover:text-primary-300 underline">
        Return to Home
      </Link>
    </div>
  );
} 