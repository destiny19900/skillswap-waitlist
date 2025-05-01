// Firebase Connection Test
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Test function to write to Firestore
export async function testFirebaseWrite() {
  try {
    console.log('Attempting to write to Firestore...');
    
    // Create a test document
    const testData = {
      test: true,
      message: 'Test submission',
      timestamp: new Date().toISOString()
    };
    
    // Attempt to write to the 'test' collection
    const docRef = await addDoc(collection(db, 'test'), testData);
    
    console.log('✅ Successfully wrote to Firestore!');
    console.log('Document ID:', docRef.id);
    return { success: true, docId: docRef.id };
  } catch (error: any) {
    console.error('❌ Error writing to Firestore:', error);
    return { success: false, error: error.message };
  }
}

// Test function to read from Firestore
export async function testFirebaseRead() {
  try {
    console.log('Attempting to read from Firestore...');
    
    // Try to read from the 'test' collection
    const querySnapshot = await getDocs(collection(db, 'test'));
    
    console.log('✅ Successfully read from Firestore!');
    console.log('Documents found:', querySnapshot.size);
    
    // Log document contents
    const documents: any[] = [];
    querySnapshot.forEach((doc) => {
      console.log(`Document ${doc.id}:`, doc.data());
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, count: querySnapshot.size, documents };
  } catch (error: any) {
    console.error('❌ Error reading from Firestore:', error);
    return { success: false, error: error.message };
  }
} 