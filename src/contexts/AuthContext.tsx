import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  username: string;
  role: 'user';
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  checkingAdmin: boolean;
  checkAdminClaim: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// SECURE: Check admin status via Firebase Custom Claims (ID Token)
// Admin claims can ONLY be set via Firebase Admin SDK (server-side)
const checkAdminCustomClaim = async (user: User): Promise<boolean> => {
  try {
    // Force refresh to get latest claims
    const idTokenResult = await user.getIdTokenResult(true);
    return idTokenResult.claims.admin === true;
  } catch (error) {
    console.error('Error checking admin claim:', error);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  // Function to check admin claim - exposed for manual verification
  const checkAdminClaim = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    return await checkAdminCustomClaim(auth.currentUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setCheckingAdmin(true);
      
      if (currentUser) {
        try {
          // Fetch user profile data
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              uid: data.uid,
              email: data.email,
              username: data.username,
              role: 'user', // Users always have 'user' role
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          }

          // SECURE: Check admin via Firebase Custom Claims (not Firestore)
          const adminStatus = await checkAdminCustomClaim(currentUser);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAdmin(false);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
      
      setCheckingAdmin(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // SECURE: User signup ALWAYS assigns role: "user"
  // Users CANNOT choose or modify their role
  const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    // Update display name
    await updateProfile(newUser, { displayName: username });
    
    // Create user document in Firestore with FIXED role: "user"
    // Role is hardcoded server-side and cannot be modified by client
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      email: newUser.email,
      username,
      role: 'user', // ALWAYS user - admins are created via Firebase Admin SDK
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

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    logout,
    isAdmin,
    checkingAdmin,
    checkAdminClaim,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
