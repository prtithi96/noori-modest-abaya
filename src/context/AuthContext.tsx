import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

export interface DbUserProfile {
  id: number;
  uid: string;
  email: string;
  displayName?: string | null;
  role: 'customer' | 'boutique' | 'admin';
  createdAt?: string;
  boutiqueProfile?: {
    id: number;
    businessName: string;
    country: string;
    city?: string | null;
    phone?: string | null;
    approvedTier: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUserProfile | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  token: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user with backend
  const syncUserWithBackend = async (idToken: string) => {
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
      }
    } catch (err) {
      console.error('Failed to sync user with database:', err);
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDbUser(data);
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
          await syncUserWithBackend(idToken);
        } catch (err) {
          console.error('Error fetching ID token:', err);
        }
      } else {
        setToken(null);
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      await syncUserWithBackend(idToken);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      throw err;
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setDbUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        token,
        loading,
        signInWithGoogle,
        signOutUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
