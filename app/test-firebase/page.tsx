"use client";

import { useState, useEffect } from 'react';
import { testFirebaseWrite, testFirebaseRead } from '@/utils/firebase-test';

export default function TestFirebase() {
  const [writeResult, setWriteResult] = useState<any>(null);
  const [readResult, setReadResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runTests() {
    setIsLoading(true);
    setError(null);
    try {
      // Test write operation
      const writeRes = await testFirebaseWrite();
      setWriteResult(writeRes);
      
      // Test read operation
      const readRes = await testFirebaseRead();
      setReadResult(readRes);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>
        
        <div className="mb-8">
          <button
            onClick={runTests}
            disabled={isLoading}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Running Tests...' : 'Run Firebase Tests'}
          </button>
        </div>
        
        {error && (
          <div className="p-4 mb-6 bg-red-500/20 border border-red-500 rounded-lg">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        {writeResult && (
          <div className="p-4 mb-6 bg-dark-800 border border-dark-600 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Write Test Result</h3>
            <div className="flex items-center mb-2">
              <div className={`w-4 h-4 rounded-full mr-2 ${writeResult.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p>{writeResult.success ? 'Success' : 'Failed'}</p>
            </div>
            {writeResult.success ? (
              <p className="text-gray-300">Document ID: {writeResult.docId}</p>
            ) : (
              <p className="text-red-400">{writeResult.error}</p>
            )}
          </div>
        )}
        
        {readResult && (
          <div className="p-4 mb-6 bg-dark-800 border border-dark-600 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Read Test Result</h3>
            <div className="flex items-center mb-2">
              <div className={`w-4 h-4 rounded-full mr-2 ${readResult.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p>{readResult.success ? 'Success' : 'Failed'}</p>
            </div>
            {readResult.success ? (
              <p className="text-gray-300">Documents found: {readResult.count}</p>
            ) : (
              <p className="text-red-400">{readResult.error}</p>
            )}
          </div>
        )}
        
        <div className="mt-8 p-4 bg-dark-800 border border-dark-600 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Debug Information</h3>
          <p className="text-gray-300 mb-2">Check the browser console for detailed logs</p>
          <div className="text-xs text-gray-400 bg-dark-950 p-3 rounded overflow-auto max-h-60">
            <pre>Note: If tests fail, you may need to update Firestore security rules in Firebase Console:</pre>
            <pre>{`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // For testing only - change this for production
      allow read, write: if true;
    }
  }
}
            `}</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 