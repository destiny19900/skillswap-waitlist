"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/utils/firebase';

type WaitlistContextType = {
  waitlistCount: number;
  incrementWaitlistCount: () => void;
};

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined);

// Update the default count to 3119
const DEFAULT_COUNT = 3119;

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  // Start with the fixed default value to avoid hydration mismatch
  const [waitlistCount, setWaitlistCount] = useState<number>(DEFAULT_COUNT);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle localStorage and API fetch after initial render
  useEffect(() => {
    // Only run this effect on the client after the initial render
    if (!isClient) return;

    // Get count from localStorage
    const getStoredCount = (): number => {
      try {
        const storedCount = localStorage.getItem('waitlistCount');
        const storedTimestamp = localStorage.getItem('waitlistCountTimestamp');
        
        if (storedCount && storedTimestamp) {
          const timestamp = parseInt(storedTimestamp);
          const now = Date.now();
          const hoursElapsed = (now - timestamp) / (1000 * 60 * 60);
          
          if (hoursElapsed < 24 && parseInt(storedCount) > DEFAULT_COUNT) {
            return parseInt(storedCount);
          }
        }
      } catch (error) {
        // Silent error in production
      }
      
      return DEFAULT_COUNT;
    };

    // Update with localStorage value
    setWaitlistCount(getStoredCount());
    
    const fetchCountFromAPI = async () => {
      try {
        const response = await fetch('/api/waitlist/count', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle the new API response format which returns a count field
        if (data && typeof data.count === 'number') {
          // Only update if the count from the API is higher than our current count
          // This prevents the count from going down if we already incremented locally
          if (data.count > waitlistCount) {
            setWaitlistCount(data.count);
            localStorage.setItem('waitlistCount', data.count.toString());
            localStorage.setItem('waitlistCountTimestamp', Date.now().toString());
          }
        }
      } catch (error) {
        // Silent error in production
      }
    };

    // Fetch the latest from API
    fetchCountFromAPI();

    // Poll for updates every 5 minutes
    const intervalId = setInterval(fetchCountFromAPI, 5 * 60 * 1000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [isClient]);

  // Update the incrementWaitlistCount function to call the API
  const incrementWaitlistCount = async () => {
    try {
      // Call the API to increment the count in Firestore
      const response = await fetch('/api/waitlist/count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // If API call was successful, update the local state with the new count
      if (data.success && data.count) {
        setWaitlistCount(data.count);
        
        // Save in localStorage for offline access
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('waitlistCount', data.count.toString());
            localStorage.setItem('waitlistCountTimestamp', Date.now().toString());
          } catch (error) {
            // Silent error in production
          }
        }
        return data.count;
      } else {
        // Fallback to local increment if API call failed but returned successfully
        setWaitlistCount(prevCount => {
          const newCount = prevCount + 1;
          try {
            localStorage.setItem('waitlistCount', newCount.toString());
            localStorage.setItem('waitlistCountTimestamp', Date.now().toString());
          } catch (error) {
            // Silent error in production
          }
          return newCount;
        });
      }
    } catch (error) {
      // If API call fails completely, fallback to local increment
      setWaitlistCount(prevCount => {
        const newCount = prevCount + 1;
        try {
          localStorage.setItem('waitlistCount', newCount.toString());
          localStorage.setItem('waitlistCountTimestamp', Date.now().toString());
        } catch (error) {
          // Silent error in production
        }
        return newCount;
      });
    }
  };

  return (
    <WaitlistContext.Provider value={{ waitlistCount, incrementWaitlistCount }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export const useWaitlist = () => {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error('useWaitlist must be used within a WaitlistProvider');
  }
  return context;
}; 