// Firebase Configuration
// Replace these with your actual Firebase project credentials
// Get these from Firebase Console > Project Settings > General

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore, disableNetwork } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

// Check if we're in development mode (using placeholder credentials)
export const isDevelopment = !import.meta.env?.VITE_FIREBASE_API_KEY || 
  import.meta.env?.VITE_FIREBASE_API_KEY === 'YOUR_API_KEY_HERE';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;

// Only initialize Firebase if we have valid credentials
if (!isDevelopment) {
  const firebaseConfig = {
    apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env?.VITE_FIREBASE_APP_ID
  };

  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
} else {
  // In development mode, create minimal mock objects to prevent errors
  // These won't actually be used since all API calls check isDevelopment first
  const mockConfig = {
    apiKey: "demo-key",
    authDomain: "demo.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id"
  };
  
  app = initializeApp(mockConfig, 'demo-app');
  auth = getAuth(app);
  
  // Initialize Firestore with settings that prevent network requests
  db = initializeFirestore(app, {
    experimentalForceLongPolling: false,
    experimentalAutoDetectLongPolling: false,
    ignoreUndefinedProperties: true,
  });
  
  storage = getStorage(app);
  functions = getFunctions(app);
  
  // Completely disable network access to prevent connection errors
  disableNetwork(db).catch(() => {
    // Ignore errors when disabling network
  });
  
  // Log once that we're in demo mode
  if (typeof window !== 'undefined') {
    console.log('🎭 Running in DEMO MODE - Using mock data (Firebase not configured)');
  }
}

export { app, auth, db, storage, functions };
export default app;
