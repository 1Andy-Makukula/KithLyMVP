import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, isDevelopment } from '../lib/firebaseConfig';
import { mockShops } from '../lib/mockData';

export interface Shop {
  id: string;
  owner_user_id: string;
  shop_name: string;
  address: string;
  logo_image_url: string;
  is_verified: boolean;
  payout_details?: {
    type: string;
    number: string;
  };
}

export async function getVerifiedShops(): Promise<Shop[]> {
  // Use mock data in development mode
  if (isDevelopment) {
    return Promise.resolve(mockShops.filter(shop => shop.is_verified));
  }

  try {
    const shopsRef = collection(db, 'shops');
    const q = query(shopsRef, where('is_verified', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Shop));
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
}

export async function getShopById(shopId: string): Promise<Shop | null> {
  // Use mock data in development mode
  if (isDevelopment) {
    const shop = mockShops.find(s => s.id === shopId);
    return Promise.resolve(shop || null);
  }

  try {
    const shopRef = doc(db, 'shops', shopId);
    const shopDoc = await getDoc(shopRef);
    
    if (shopDoc.exists()) {
      return {
        id: shopDoc.id,
        ...shopDoc.data()
      } as Shop;
    }
    return null;
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
}

export async function updateShopPayoutDetails(shopId: string, payoutDetails: { type: string; number: string }) {
  // In development mode, just simulate success
  if (isDevelopment) {
    console.log('Mock: Updated payout details for shop', shopId, payoutDetails);
    return Promise.resolve();
  }

  try {
    const shopRef = doc(db, 'shops', shopId);
    await updateDoc(shopRef, {
      payout_details: payoutDetails
    });
  } catch (error) {
    console.error('Error updating payout details:', error);
    throw error;
  }
}
