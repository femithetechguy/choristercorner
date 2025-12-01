/**
 * Firebase Configuration & Setup Guide
 * 
 * This file handles Firebase authentication and database setup.
 * Follow the steps below to enable Firebase in your app.
 */

import { FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

/**
 * Step 1: Get your Firebase config
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project or select existing one
 * 3. Go to Project Settings (gear icon)
 * 4. Copy the firebaseConfig object
 * 5. Add the values to your .env.local file
 */

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

/**
 * TODO: Uncomment to initialize Firebase
 * Initialize Firebase app
 */
// const app = initializeApp(firebaseConfig);

/**
 * TODO: Uncomment to initialize Authentication
 * Initialize Firebase Authentication and get a reference to the service
 */
// export const auth: Auth = getAuth(app);

/**
 * Example: Sign up with email and password
 * 
 * import { createUserWithEmailAndPassword } from 'firebase/auth';
 * 
 * const signup = async (email: string, password: string) => {
 *   try {
 *     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
 *     return userCredential.user;
 *   } catch (error) {
 *     console.error('Signup error:', error);
 *     throw error;
 *   }
 * };
 */

/**
 * Example: Sign in with email and password
 * 
 * import { signInWithEmailAndPassword } from 'firebase/auth';
 * 
 * const login = async (email: string, password: string) => {
 *   try {
 *     const userCredential = await signInWithEmailAndPassword(auth, email, password);
 *     return userCredential.user;
 *   } catch (error) {
 *     console.error('Login error:', error);
 *     throw error;
 *   }
 * };
 */

/**
 * Example: Sign out
 * 
 * import { signOut } from 'firebase/auth';
 * 
 * const logout = async () => {
 *   try {
 *     await signOut(auth);
 *   } catch (error) {
 *     console.error('Logout error:', error);
 *   }
 * };
 */
