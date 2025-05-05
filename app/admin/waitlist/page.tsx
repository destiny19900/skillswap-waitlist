"use client";

import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  waitlistRank: number;
  createdAt: string | null;
  learningSkills: string[];
  teachingSkills: string[];
  wantsToTeach: boolean;
  points: number;
}

// Helper functions for cookie management
const setAuthCookie = (value: string, expiryHours: number = 24) => {
  const date = new Date();
  date.setTime(date.getTime() + expiryHours * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `waitlist_admin_auth=${value}; ${expires}; path=/; SameSite=Strict`;
};

// Clear the auth cookie
const clearAuthCookie = () => {
  document.cookie = "waitlist_admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
};

// Check if auth cookie exists
const checkAuthCookie = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(item => item.trim().startsWith('waitlist_admin_auth=true'));
};

export default function AdminWaitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Hardcoded password - in production, this should be an environment variable
  // TODO: Move to environment variable process.env.ADMIN_PASSWORD
  const correctPassword = "skillpod2024";
  
  const authenticate = () => {
    try {
      // Simple direct comparison for now
      if (password === correctPassword) {
        setIsAuthed(true);
        setAuthCookie('true');
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('An error occurred during authentication');
    }
  };

  // Fetch waitlist from server API
  const fetchWaitlist = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Fetching waitlist entries from API...');
      
      const response = await fetch('/api/admin/waitlist');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API returned ${response.status}: ${response.statusText}${errorData.message ? ` - ${errorData.message}` : ''}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data.waitlist)) {
        console.log('Found waitlist entries:', data.waitlist.length);
        setEntries(data.waitlist);
        
        // Check if we're using mock data
        if (data.isMockData) {
          setError("⚠️ Using mock data - this is not real user data. For real data, configure Firebase Admin credentials in .env.local");
        }
      } else {
        console.log('No waitlist entries found or invalid response format');
        setEntries([]);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching waitlist:', error);
      setError(`Failed to fetch waitlist: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if already authenticated and the session isn't too old (24 hours)
    if (checkAuthCookie()) {
      setIsAuthed(true);
    }

    if (isAuthed) {
      fetchWaitlist();
    }
  }, [isAuthed]);

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-dark-800 flex flex-col items-center justify-center p-4">
        <div className="bg-dark-700 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Authentication</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 rounded bg-dark-600 text-white border border-dark-500 focus:border-primary-500 focus:outline-none mb-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter') authenticate();
            }}
          />
          <button
            onClick={authenticate}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Waitlist Registrations</h1>
          <div className="flex space-x-2">
            <button
              onClick={fetchWaitlist}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Refresh Data
            </button>
            <button
              onClick={() => {
                clearAuthCookie();
                setIsAuthed(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-white p-4 rounded-lg mb-4">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
            <p className="mt-2 text-sm">Check the console for more information.</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500 border-r-2 border-primary-300"></div>
            <p className="text-gray-400 mt-2">Loading waitlist data...</p>
          </div>
        ) : (
          <>
            <div className="bg-dark-700 p-4 rounded-lg mb-4">
              <p className="text-white">Total Registrations: <span className="font-bold text-primary-400">{entries.length}</span></p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-dark-700 rounded-lg overflow-hidden">
                <thead className="bg-dark-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Skills Learning</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Skills Teaching</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-dark-600">
                      <td className="px-4 py-3 whitespace-nowrap text-primary-400 font-medium">#{entry.waitlistRank}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-white">{entry.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300">{entry.email}</td>
                      <td className="px-4 py-3 text-gray-300">
                        <div className="flex flex-wrap gap-1">
                          {entry.learningSkills?.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary-900/30 text-primary-300 text-xs rounded-full">
                              {skill}
                            </span>
                          )) || "None"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        <div className="flex flex-wrap gap-1">
                          {entry.teachingSkills?.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-accent-900/30 text-accent-300 text-xs rounded-full">
                              {skill}
                            </span>
                          )) || "None"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-accent-400">{entry.points || 0}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                        {entry.createdAt ? 
                          new Date(entry.createdAt).toLocaleDateString() : 
                          "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {entries.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p>No waitlist registrations found.</p>
                <button
                  onClick={fetchWaitlist}
                  className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 