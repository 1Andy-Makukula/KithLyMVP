import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { Product } from '../types'; // We'll create this type definition next

export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  const productsCol = collection(db, 'products');
  const q = query(productsCol, where('shop_id', '==', shopId));
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
};

export const addProduct = async (shopId: string, productData: Omit<Product, 'id' | 'shop_id'>) => {
  const productsCol = collection(db, 'products');
  return await addDoc(productsCol, {
    ...productData,
    shop_id: shopId,
    createdAt: serverTimestamp(),
  });
};

export const updateProduct = async (productId: string, productData: Partial<Product>) => {
  const productRef = doc(db, 'products', productId);
  return await updateDoc(productRef, productData);
};

export const deleteProduct = async (productId: string) => {
  const productRef = doc(db, 'products', productId);
  return await deleteDoc(productRef);
};
