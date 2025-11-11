import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAGCdHEfybXgLU_BTxqm2yrx7fo6jT_c_g",
  authDomain: "taskify-addcd.firebaseapp.com",
  projectId: "taskify-addcd",
  storageBucket: "taskify-addcd.firebasestorage.app",
  messagingSenderId: "488071227535",
  appId: "1:488071227535:web:c486f7b28f9223cb2a28fa",
  measurementId: "G-P5ZNPQZ00L"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
