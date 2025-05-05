import * as admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';

// Server-side Firebase configuration - uses private environment variables
// This file is only imported in server components or API routes

let app: admin.app.App | undefined;
let adminDb: Firestore | null = null;

try {
  // Check if Firebase is already initialized
  if (admin.apps.length > 0) {
    app = admin.app();
    adminDb = admin.firestore();
  } else {
    // Make sure we have the required environment variables
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      // For development, we'll create a temporary mock
      if (process.env.NODE_ENV === 'development') {
        // Mock the admin functionality for development with any type to bypass type checking
        adminDb = {
          collection: () => ({
            get: async () => ({
              empty: false,
              docs: [
                {
                  id: "mock-id-1",
                  data: () => ({
                    name: "Test User",
                    email: "test@example.com",
                    waitlistRank: 3050,
                    createdAt: { toDate: () => new Date() },
                    learningSkills: ["React", "Next.js"],
                    teachingSkills: ["Design"],
                    wantsToTeach: true,
                    points: 10
                  })
                }
              ]
            }),
            count: () => ({
              get: async () => ({
                data: () => ({ count: 0 })
              })
            })
          })
        } as any; // Cast to any to bypass type checking for mock
      }
    } else {
      // Process the private key - handle different formats
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // If the key contains literal '\n' strings, replace them with actual newlines
      if (privateKey && privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      const firebaseConfig = {
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      };
      
      try {
        app = admin.initializeApp(firebaseConfig);
        adminDb = admin.firestore();
      } catch (initError: any) {
        // Mock the admin functionality for development as fallback
        if (process.env.NODE_ENV === 'development') {
          adminDb = {
            collection: () => ({
              get: async () => ({
                empty: false,
                docs: [{ id: "error-fallback", data: () => ({ error: true }) }]
              }),
              count: () => ({
                get: async () => ({
                  data: () => ({ count: 0 })
                })
              })
            })
          } as any; // Cast to any to bypass type checking for mock
        }
      }
    }
  }
} catch (error: any) {
  // Silent error in production
}

// Export Firestore instance
export { adminDb }; 