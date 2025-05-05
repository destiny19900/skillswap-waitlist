"use client";

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export default function TestFirebase() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('Test User');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult('');
    setError('');

    try {
      console.log("Attempting to add document to waitlist collection...");
      
      // Submit to the actual waitlist collection to trigger the email function
      const docRef = await addDoc(collection(db, 'waitlist'), {
        email: email,
        name: name,
        waitlistRank: 3087, // Fixed rank for testing
        learningSkills: ["Testing"],
        teachingSkills: [],
        wantsToTeach: false,
        points: 0,
        socialActions: {
          sharedTwitter: false,
          joinedDiscord: false,
          invitedFriends: false,
        },
        createdAt: new Date().toISOString()
      });
      
      console.log("Document written with ID: ", docRef.id);
      setResult(`Success! Document added with ID: ${docRef.id}. Check your email (${email}) for the confirmation.`);
      setEmail('');
    } catch (err) {
      console.error("Error adding document: ", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-800 text-white flex items-center justify-center p-4">
      <div className="bg-dark-700 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Firebase Email Test</h1>
        <p className="mb-4 text-gray-300 text-center">
          This form will submit to the waitlist collection and should trigger an email.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your email"
              required
            />
            <p className="mt-1 text-sm text-yellow-500">
              Use a real email - a confirmation will be sent to this address!
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit & Test Email'}
          </button>
        </form>
        
        {result && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-md text-green-400">
            {result}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400">
            {error}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-400">
          <p>This test:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Submits to the <code>waitlist</code> collection</li>
            <li>Should trigger the Firebase function</li>
            <li>Should send an email to the address provided</li>
          </ol>
          <p className="mt-4">
            <strong>Note:</strong> Check your email inbox, spam folder, and Firebase function logs if no email arrives.
          </p>
        </div>
      </div>
    </div>
  );
} 