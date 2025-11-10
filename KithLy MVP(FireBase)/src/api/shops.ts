import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { Shop } from '../types'; // I will create this type definition

export const getVerifiedShops = async (): Promise<Shop[]> => {
  const shopsCol = collection(db, 'shops');
  const q = query(shopsCol, where('is_verified', '==', true));
  const querySnapshot = await getDocs(q);
  const shops: Shop[] = [];
  querySnapshot.forEach((doc) => {
    shops.push({ id: doc.id, ...doc.data() } as Shop);
  });
  return shops;
};

export const getShopById = async (shopId: string): Promise<Shop | null> => {
  const shopRef = doc(db, 'shops', shopId);
  const shopSnap = await getDoc(shopRef);

  if (shopSnap.exists()) {
    return { id: shopSnap.id, ...shopSnap.data() } as Shop;
  } else {
    return null;
  }
};
