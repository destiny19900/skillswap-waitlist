"use client";

import React, { useState } from 'react';
import { ArrowRight, Check, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TestSMTP() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const startTime = new Date();
      const response = await fetch('/api/test-smtp');
      const endTime = new Date();
      const responseTime = endTime.getTime() - startTime.getTime();
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      setResult({
        ...data,
        responseTime: `${responseTime}ms`
      });
    } catch (err: any) {
      setError(err.message || 'Failed to run test');
      console.error('Test error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-800 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
            SMTP Configuration Test
          </h1>
          <p className="text-gray-400">
            Test your SMTP configuration to ensure email sending is working correctly.
          </p>
        </header>

        <div className="premium-card p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Configuration</h2>
            <p className="text-gray-400 mb-4">
              This test will check your SMTP settings defined in .env.local file.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-dark-700 p-4 rounded">
                <p className="text-gray-300 font-semibold">Host</p>
                <p className="text-primary-400">{process.env.SMTP_HOST || 'Not set (use SMTP_HOST)'}</p>
              </div>
              <div className="bg-dark-700 p-4 rounded">
                <p className="text-gray-300 font-semibold">Port</p>
                <p className="text-primary-400">{process.env.SMTP_PORT || '587 (default)'}</p>
              </div>
              <div className="bg-dark-700 p-4 rounded">
                <p className="text-gray-300 font-semibold">Secure</p>
                <p className="text-primary-400">{process.env.NEXT_PUBLIC_SMTP_SECURE || 'false (default)'}</p>
              </div>
              <div className="bg-dark-700 p-4 rounded">
                <p className="text-gray-300 font-semibold">Recipient</p>
                <p className="text-primary-400">alvintye22@gmail.com</p>
              </div>
            </div>
          </div>
          
          <Button onClick={runTest} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Running Test...
              </>
            ) : (
              <>
                Run SMTP Test <ArrowRight className="ml-2" size={18} />
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error running test</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="premium-card p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            <div className="mb-4">
              <p className="text-gray-300 font-medium mb-2">Response Time</p>
              <p className="text-accent-400">{result.responseTime}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 font-medium mb-2">Configuration</p>
              <div className="bg-dark-700 p-4 rounded-lg">
                <pre className="text-sm overflow-auto whitespace-pre-wrap">{JSON.stringify(result.config, null, 2)}</pre>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <p className="text-gray-300 font-medium">Connection Verification</p>
                <div className={`ml-2 px-2 py-0.5 text-xs rounded ${result.verification === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.verification === 'Success' ? 'Passed' : 'Failed'}
                </div>
              </div>
              {result.verification !== 'Success' && (
                <p className="text-red-400 text-sm">{result.verification}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <p className="text-gray-300 font-medium">Email Sending</p>
                <div className={`ml-2 px-2 py-0.5 text-xs rounded ${result.send === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.send === 'Success' ? 'Passed' : 'Failed'}
                </div>
              </div>
              {result.send === 'Success' ? (
                <div className="flex items-center text-green-400">
                  <Check size={16} className="mr-1" />
                  <p className="text-sm">Email sent successfully with ID: {result.messageId}</p>
                </div>
              ) : (
                <p className="text-red-400 text-sm">{result.send}</p>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-dark-600">
              <p className="text-xs text-gray-500">Test completed at: {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button variant="secondary" href="/">Back to Home</Button>
        </div>
      </div>
    </div>
  );
} 