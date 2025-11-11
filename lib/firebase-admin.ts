// Firebase Admin SDK for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    // For development: Use environment variables
    // For production: Use service account key file
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      })
    } else {
      console.warn('⚠️ Firebase Admin credentials not found. Using default initialization.')
      // For Next.js API routes, we can use client SDK instead
      // This is fine for email sending via Gmail SMTP
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
  }
}

export const adminAuth = getApps().length > 0 ? getAuth() : null
