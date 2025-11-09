import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isDevelopment } from '../lib/firebaseConfig';
import { mockUser, mockUserData } from '../lib/mockData';

export interface UserData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  roles: string[];
  shop_id?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(!isDevelopment); // Start not-loading in dev mode

  useEffect(() => {
    // In development mode, use mock authentication
    if (isDevelopment) {
      // Immediately set to not loading in dev mode
      setUser(null);
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Fetch user data from Firestore
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              setUserData(userDoc.data() as UserData);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
      return;
    }
  }, []);

  const hasRole = (role: string) => {
    return userData?.roles?.includes(role) || false;
  };

  const isAdmin = () => hasRole('admin');
  const isShopOwner = () => hasRole('shop_owner');
  const isCustomer = () => hasRole('customer');

  return {
    user,
    userData,
    loading,
    hasRole,
    isAdmin,
    isShopOwner,
    isCustomer
  };
}
