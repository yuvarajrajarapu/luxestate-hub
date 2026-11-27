import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserCredential } from 'firebase/auth';

interface UserData {
  uid: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGoogleCredential: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  checkingAdmin: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const loadFirebaseAuth = async () => {
  const [firebaseAuth, authSdk] = await Promise.all([
    import('@/lib/firebase-auth'),
    import('firebase/auth'),
  ]);
  return { auth: firebaseAuth.auth, ...authSdk };
};

const loadFirebaseFirestore = async () => {
  const [firestore, firebase] = await Promise.all([
    import('firebase/firestore'),
    import('@/lib/firebase'),
  ]);
  return { ...firestore, db: firebase.db };
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  // Function to fetch user data and check admin status
  const fetchUserData = async (currentUser: User) => {
    try {
      const { doc, getDoc, db } = await loadFirebaseFirestore();
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const fetchedUserData: UserData = {
          uid: data.uid,
          email: data.email,
          username: data.username,
          role: data.role || 'user',
          createdAt: data.createdAt?.toDate() || new Date(),
        };
        setUserData(fetchedUserData);
        
        // Check if role is admin
        setIsAdmin(data.role === 'admin');
        return fetchedUserData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Refresh user data (useful after role change)
  const refreshUserData = async () => {
    const { auth } = await loadFirebaseAuth();
    if (auth.currentUser) {
      setCheckingAdmin(true);
      await fetchUserData(auth.currentUser);
      setCheckingAdmin(false);
    }
  };

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    let authTimer: number | undefined;

    const initializeAuthState = async () => {
      try {
        const { auth, onAuthStateChanged } = await loadFirebaseAuth();
        if (!active) return;

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (!active) return;

          setUser(currentUser);
          setCheckingAdmin(true);

          if (currentUser) {
            await fetchUserData(currentUser);
          } else {
            setUserData(null);
            setIsAdmin(false);
          }

          if (!active) return;
          setCheckingAdmin(false);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error initializing authentication:', error);
        if (active) {
          setCheckingAdmin(false);
          setLoading(false);
        }
      }
    };

    const scheduleAuthInitialization = () => {
      authTimer = window.setTimeout(() => {
        void initializeAuthState();
      }, 1500);
    };

    if (document.readyState === 'complete') {
      scheduleAuthInitialization();
    } else {
      window.addEventListener('load', scheduleAuthInitialization, { once: true });
    }

    return () => {
      active = false;
      unsubscribe?.();
      window.removeEventListener('load', scheduleAuthInitialization);
      if (authTimer !== undefined) window.clearTimeout(authTimer);
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    const { auth, signInWithEmailAndPassword } = await loadFirebaseAuth();
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // User signup - automatically assigns role: "user"
  const signUp = async (email: string, password: string, username: string) => {
    const {
      auth,
      createUserWithEmailAndPassword,
      updateProfile,
    } = await loadFirebaseAuth();
    const { doc, setDoc, serverTimestamp, db } = await loadFirebaseFirestore();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    // Update display name
    await updateProfile(newUser, { displayName: username });
    
    // Create user document with role: "user" (you can change to "admin" in Firebase Console)
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      email: newUser.email,
      username,
      role: 'user', // ← Automatically set to "user", edit in Firebase Console to make admin
      createdAt: serverTimestamp(),
    });

    setUserData({
      uid: newUser.uid,
      email: newUser.email!,
      username,
      role: 'user',
      createdAt: new Date(),
    });
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const { auth, GoogleAuthProvider, signInWithPopup } = await loadFirebaseAuth();
      const { doc, getDoc, setDoc, serverTimestamp, db } = await loadFirebaseFirestore();
      const googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      googleProvider.setCustomParameters({
        prompt: 'consent',
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;
      
      // Create user document if it doesn't exist
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          username,
          role: 'user',
          createdAt: serverTimestamp(),
          authProvider: 'google',
        });
      }
      
      // Fetch user data to update context
      await fetchUserData(currentUser);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithGoogleCredential = async (credential: string): Promise<void> => {
    try {
      const { auth, GoogleAuthProvider, signInWithCredential } = await loadFirebaseAuth();
      const { doc, getDoc, setDoc, serverTimestamp, db } = await loadFirebaseFirestore();
      // Authenticate with Google credential token from One Tap
      const googleCredential = GoogleAuthProvider.credential(null, credential);
      
      const result = await signInWithCredential(auth, googleCredential);
      const currentUser = result.user;
      
      // Create user document if it doesn't exist
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          username,
          role: 'user',
          createdAt: serverTimestamp(),
          authProvider: 'google',
        });
      }
      
      // Fetch user data to update context
      await fetchUserData(currentUser);
    } catch (error) {
      console.error('Google credential sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const { auth, signOut } = await loadFirebaseAuth();
    await signOut(auth);
    setUserData(null);
    setIsAdmin(false);
  };

  // Helper function to create or fetch user document
  const createOrFetchUserDoc = async (currentUser: User): Promise<UserData | null> => {
    try {
      const { doc, getDoc, setDoc, serverTimestamp, db } = await loadFirebaseFirestore();
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // User document already exists
        const data = userDoc.data();
        const fetchedUserData: UserData = {
          uid: data.uid,
          email: data.email,
          username: data.username,
          role: data.role || 'user',
          createdAt: data.createdAt?.toDate() || new Date(),
        };
        setUserData(fetchedUserData);
        setIsAdmin(data.role === 'admin');
        return fetchedUserData;
      } else {
        // Create new user document
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          username,
          role: 'user',
          createdAt: serverTimestamp(),
          authProvider: 'google', // Track authentication method
        });
        
        const newUserData: UserData = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          username,
          role: 'user',
          createdAt: new Date(),
        };
        setUserData(newUserData);
        setIsAdmin(false);
        return newUserData;
      }
    } catch (error) {
      console.error('Error creating/fetching user document:', error);
      return null;
    }
  };


  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGoogleCredential,
    logout,
    isAdmin,
    checkingAdmin,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
