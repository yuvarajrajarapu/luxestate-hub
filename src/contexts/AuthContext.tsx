import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  username: string;
  createdAt: Date;
}

import { UserCredential } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  checkingAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Secure admin check from user_roles collection
const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const rolesRef = collection(db, 'user_roles');
    const q = query(rolesRef, where('user_id', '==', userId), where('role', '==', 'admin'));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setCheckingAdmin(true);
      
      if (user) {
        try {
          // Fetch user profile data
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              uid: data.uid,
              email: data.email,
              username: data.username,
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          }

          // Check admin role from separate user_roles collection (secure)
          const adminStatus = await checkAdminRole(user.uid);
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

  const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName: username });
    
    // Create user document in Firestore (no role stored here for security)
    const newUserData: UserData = {
      uid: user.uid,
      email: user.email!,
      username,
      createdAt: new Date(),
    };
    
    await setDoc(doc(db, 'users', user.uid), newUserData);
    setUserData(newUserData);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
