// Firebase Configuration
// Update these with your Firebase project credentials
// You can find these in your Firebase Console > Project Settings

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase (to be used in your app)
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// 
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
