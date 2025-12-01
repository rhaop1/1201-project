import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase 설정
 */
const firebaseConfig = {
  apiKey: "AIzaSyCuCYH38ZqKbtPYPR2ED1nMdD6yBuo1ReA",
  authDomain: "shop-d542c.firebaseapp.com",
  projectId: "shop-d542c",
  storageBucket: "shop-d542c.firebasestorage.app",
  messagingSenderId: "592347281413",
  appId: "1:592347281413:web:ed7c8752b195dcbb02846c",
  measurementId: "G-DFV2PBV8X2"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 초기화
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
