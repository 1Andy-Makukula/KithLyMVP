import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, isDevelopment } from '../lib/firebaseConfig';
import { mockProducts } from '../lib/mockData';

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  price_zmw: number;
  description: string;
  image_url: string;
  is_available: boolean;
}

let localProducts = [...mockProducts];

export async function getProductsByShopId(shopId: string): Promise<Product[]> {
  // Use mock data in development mode
  if (isDevelopment) {
    return Promise.resolve(localProducts.filter(p => p.shop_id === shopId && p.is_available));
  }

  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('shop_id', '==', shopId), where('is_available', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  // In development mode, add to local mock data
  if (isDevelopment) {
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`
    };
    localProducts.push(newProduct as Product);
    console.log('Mock: Added product', newProduct);
    return Promise.resolve(newProduct.id);
  }

  try {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, product);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function updateProduct(productId: string, updates: Partial<Product>) {
  // In development mode, update local mock data
  if (isDevelopment) {
    const index = localProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
      localProducts[index] = { ...localProducts[index], ...updates };
      console.log('Mock: Updated product', localProducts[index]);
    }
    return Promise.resolve();
  }

  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updates);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  // In development mode, remove from local mock data
  if (isDevelopment) {
    localProducts = localProducts.filter(p => p.id !== productId);
    console.log('Mock: Deleted product', productId);
    return Promise.resolve();
  }

  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
