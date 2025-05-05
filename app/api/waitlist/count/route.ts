import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-server';
import { Firestore } from 'firebase-admin/firestore';

// Base count to start with - this will be added to the actual count
const BASE_COUNT = 3087;

export async function GET(request: Request) {
  try {
    // If adminDb is not available, return the base count for development
    if (!adminDb) {
      return NextResponse.json({ count: BASE_COUNT });
    }
    
    try {
      // Get count of documents in the waitlist collection using admin SDK
      const waitlistRef = adminDb.collection('waitlist');
      const countQuery = waitlistRef.count();
      const snapshot = await countQuery.get();
      const actualCount = snapshot.data().count;
      
      // Add the base count to the actual count
      const totalCount = BASE_COUNT + actualCount;
      
      // Get or create the global counter document
      try {
        const counterRef = adminDb.collection('system').doc('counters');
        const counterDoc = await counterRef.get();
        
        if (!counterDoc.exists) {
          // Create the counter document if it doesn't exist
          await counterRef.set({
            waitlistTotalCount: totalCount,
            actualWaitlistCount: actualCount,
            baseCount: BASE_COUNT,
            lastUpdated: new Date()
          });
        } else {
          // Update the counter document
          await counterRef.update({
            waitlistTotalCount: totalCount,
            actualWaitlistCount: actualCount,
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        // Silently continue if counter update fails
      }
      
      // Only return the total count to the client
      return NextResponse.json({ count: totalCount });
    } catch (firestoreError: any) {
      // In development, return the base count on error
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ count: BASE_COUNT });
      }
      
      throw firestoreError;
    }
  } catch (error: any) {
    // For production, don't expose error details
    return NextResponse.json(
      { error: 'Failed to get waitlist count' },
      { status: 500 }
    );
  }
} 