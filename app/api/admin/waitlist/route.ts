import { NextResponse } from 'next/server';
// @ts-ignore - Importing adminDb with unknown type
import { adminDb } from '@/utils/firebase-server';
import { Firestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

// Use a utility function to handle the database with proper typing
const getDb = (): Firestore | null => {
  return adminDb as unknown as Firestore | null;
};

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  waitlistRank?: number;
  createdAt: string | null;
  learningSkills?: string[];
  teachingSkills?: string[];
  wantsToTeach?: boolean;
  points?: number;
}

// Mock data for development - only used when Firebase is not available
const MOCK_WAITLIST_DATA = [
  // Reduced to a single entry for production
  {
    id: "mock-1",
    name: "Example User",
    email: "example@example.com",
    waitlistRank: 3020,
    createdAt: new Date().toISOString(),
    learningSkills: ["Skill 1", "Skill 2"],
    teachingSkills: ["Skill 3"],
    wantsToTeach: true,
    points: 10
  }
];

export async function GET(request: Request) {
  try {
    // Basic authentication verification
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const db = getDb();
    
    // Only use mock data if adminDb is not available
    const useMockData = !db; 
    
    if (useMockData && process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        waitlist: MOCK_WAITLIST_DATA,
        isMockData: true
      });
    } else if (useMockData) {
      // In production, if DB is not available, return error
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      );
    }
    
    // Get all waitlist entries from Firestore using admin SDK (bypasses security rules)
    try {
      if (!db) {
        throw new Error("Firebase Admin DB not initialized");
      }
      
      const waitlistSnapshot = await db.collection('waitlist').get();
      
      if (waitlistSnapshot.empty) {
        return NextResponse.json({ waitlist: [] });
      }
      
      // Convert the data to a format that can be sent as JSON
      const waitlist = waitlistSnapshot.docs.map((doc: any) => {
        const data = doc.data();
        
        // Handle different date formats for createdAt
        let createdAtISO = null;
        if (data.createdAt) {
          try {
            // Check if it's a Firebase Timestamp (has toDate method)
            if (typeof data.createdAt.toDate === 'function') {
              createdAtISO = data.createdAt.toDate().toISOString();
            } 
            // Check if it's already a Date
            else if (data.createdAt instanceof Date) {
              createdAtISO = data.createdAt.toISOString();
            }
            // Check if it's a string that can be parsed as a date
            else if (typeof data.createdAt === 'string') {
              createdAtISO = new Date(data.createdAt).toISOString();
            }
            // Check if it's a number (timestamp)
            else if (typeof data.createdAt === 'number') {
              createdAtISO = new Date(data.createdAt).toISOString();
            }
          } catch (e) {
            // Silent error in production
          }
        }
        
        return {
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || 'No email',
          waitlistRank: data.waitlistRank || 9999,
          createdAt: createdAtISO,
          learningSkills: Array.isArray(data.learningSkills) ? data.learningSkills : [],
          teachingSkills: Array.isArray(data.teachingSkills) ? data.teachingSkills : [],
          wantsToTeach: Boolean(data.wantsToTeach),
          points: Number(data.points || 0)
        } as WaitlistEntry;
      });
      
      // Sort by waitlist rank
      waitlist.sort((a: WaitlistEntry, b: WaitlistEntry) => {
        if (a.waitlistRank && b.waitlistRank) {
          return a.waitlistRank - b.waitlistRank;
        }
        return 0;
      });
      
      return NextResponse.json({ waitlist });
    } catch (firestoreError: any) {
      // Fall back to mock data in case of error in development
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ 
          waitlist: MOCK_WAITLIST_DATA,
          isMockData: true
        });
      }
      
      // In production, return a generic error
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    // Return minimal error info in production
    return NextResponse.json(
      { error: 'Failed to fetch waitlist entries' },
      { status: 500 }
    );
  }
}

// Simple verification function - can be enhanced with proper JWT validation
async function verifyAdminAuth(request: Request): Promise<boolean> {
  try {
    // Check for admin auth in cookies (set by admin page when authenticated)
    const cookieStore = cookies();
    const authCookie = cookieStore.get('waitlist_admin_auth');
    
    if (authCookie && authCookie.value === 'true') {
      return true;
    }
    
    // For development environment only - allow access
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    // Check headers for API key if implemented
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Compare with env variable (or implement proper JWT verification)
      return token === process.env.ADMIN_API_KEY;
    }
    
    return false;
  } catch (error) {
    return false;
  }
} 