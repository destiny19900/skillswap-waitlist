"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, getCountFromServer } from 'firebase/firestore';
import { db } from '@/utils/firebase';

type WaitlistContextType = {
  waitlistCount: number;
  incrementWaitlistCount: () => void;
};

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined);

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [waitlistCount, setWaitlistCount] = useState<number>(3087); // Starting with static count

  // Fetch initial count from Firestore on first load
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const waitlistCollection = collection(db, 'waitlist');
        const snapshot = await getCountFromServer(waitlistCollection);
        const count = snapshot.data().count;
        
        // If count is less than our default, keep the default value
        if (count >= 3000) {
          setWaitlistCount(count);
        }
      } catch (error) {
        console.error('Error fetching waitlist count:', error);
      }
    };

    fetchCount();
  }, []);

  const incrementWaitlistCount = () => {
    setWaitlistCount(prevCount => prevCount + 1);
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