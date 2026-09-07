import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiwim7iRrvXpTmdd9WjWKcWv7JuhvlUoA",
  authDomain: "sevis-ht.firebaseapp.com",
  projectId: "sevis-ht",
  storageBucket: "sevis-ht.firebasestorage.app",
  messagingSenderId: "125993152800",
  appId: "1:125993152800:web:1266c861637791ebeaa745",
  measurementId: "G-6VXLVWCDC1"
};

// Evite inisyalize Firebase plis pase yon fwa
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
