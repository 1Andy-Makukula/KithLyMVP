import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isDevelopment } from '../lib/firebaseConfig';

// Define the structure of our user profile data from Firestore
interface UserProfile {
  roles: {
    admin?: boolean;
    shop_owner?: boolean;
    customer?: boolean;
  };
  shop_id?: string;
}

// Define the state that the hook will return
interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isShopOwner: boolean;
  isAdmin: boolean;
}

// Create a mock user for development mode
const mockUser: User = {
  uid: 'mock-user-123',
  email: 'dev@kith.ly',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  // Add any other required User properties with default values
} as User;

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isDevelopment) {
      setLoading(false);
      // Set a consistent mock state for development
      setUser(mockUser);
      setProfile({
        roles: { shop_owner: true, customer: true },
        shop_id: 'mock-shop-123'
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError(null);

      if (user) {
        setUser(user);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            console.warn("No user profile document found for UID:", user.uid);
            setProfile({ roles: { customer: true } });
          }
        } catch (err) {
          setError(err as Error);
          console.error("Failed to fetch user profile:", err);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    isShopOwner: profile?.roles?.shop_owner ?? false,
    isAdmin: profile?.roles?.admin ?? false,
  };
};
