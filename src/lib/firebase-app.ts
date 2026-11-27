import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBhr_F3UQqdLHYb7I4K6bEqKtw6zhvYJhU",
  authDomain: "yuvainfraedge.firebaseapp.com",
  projectId: "yuvainfraedge",
  storageBucket: "yuvainfraedge.firebasestorage.app",
  messagingSenderId: "242203271636",
  appId: "1:242203271636:web:a9418ae485bde9b145b641",
  measurementId: "G-G7NC9PVC85"
};

const app = initializeApp(firebaseConfig);

export default app;
