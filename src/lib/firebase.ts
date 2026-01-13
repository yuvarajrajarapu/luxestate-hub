import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBhr_F3UQqdLHYb7I4K6bEqKtw6zhvYJhU",
  authDomain: "yuvainfraedge.firebaseapp.com",
  projectId: "yuvainfraedge",
  storageBucket: "yuvainfraedge.firebasestorage.app",
  messagingSenderId: "242203271636",
  appId: "1:242203271636:web:a9418ae485bde9b145b641",
  measurementId: "G-G7NC9PVC85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
