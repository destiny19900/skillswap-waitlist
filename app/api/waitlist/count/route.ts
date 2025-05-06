import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase-server';

// Collection name for the counter
const COUNTER_COLLECTION = 'system';
const COUNTER_DOC = 'waitlist';
const DEFAULT_COUNT = 3119;

export async function GET() {
  try {
    // Check if adminDb is initialized
    if (!adminDb) {
      return NextResponse.json({ 
        count: DEFAULT_COUNT,
        error: 'Admin database not initialized' 
      });
    }

    // Get the counter from Firestore
    const counterRef = adminDb.collection(COUNTER_COLLECTION).doc(COUNTER_DOC);
    const counterDoc = await counterRef.get();
    
    if (!counterDoc.exists) {
      // Initialize the counter if it doesn't exist
      await counterRef.set({
        count: DEFAULT_COUNT,
        lastUpdated: new Date().toISOString(),
      });
      
      return NextResponse.json({
        count: DEFAULT_COUNT,
        isDefault: true,
      });
    }
    
    const data = counterDoc.data();
    return NextResponse.json({
      count: data?.count || DEFAULT_COUNT,
      lastUpdated: data?.lastUpdated,
    });
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return NextResponse.json(
      { count: DEFAULT_COUNT, error: 'Failed to fetch count' },
      { status: 500 }
    );
  }
}

// Add the ability to increment the counter
export async function POST() {
  try {
    // Check if adminDb is initialized
    if (!adminDb) {
      return NextResponse.json({ 
        error: 'Admin database not initialized' 
      }, { status: 500 });
    }

    const counterRef = adminDb.collection(COUNTER_COLLECTION).doc(COUNTER_DOC);
    
    // Use a transaction to ensure accurate counting
    const result = await adminDb.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      if (!counterDoc.exists) {
        // Initialize with default+1 if not exists
        transaction.set(counterRef, {
          count: DEFAULT_COUNT + 1,
          lastUpdated: new Date().toISOString(),
        });
        return DEFAULT_COUNT + 1;
      }
      
      // Get current value and increment
      const data = counterDoc.data();
      const newCount = (data?.count || DEFAULT_COUNT) + 1;
      
      // Update document
      transaction.update(counterRef, {
        count: newCount,
        lastUpdated: new Date().toISOString(),
      });
      
      return newCount;
    });
    
    return NextResponse.json({
      count: result,
      success: true,
    });
  } catch (error) {
    console.error('Error incrementing waitlist count:', error);
    return NextResponse.json(
      { error: 'Failed to increment count' },
      { status: 500 }
    );
  }
} 