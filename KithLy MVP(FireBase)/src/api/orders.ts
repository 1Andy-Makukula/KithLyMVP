import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, isDevelopment } from '../lib/firebaseConfig';
import { mockOrders } from '../lib/mockData';

export interface OrderItem {
  product_id: string;
  name: string;
  price_at_purchase: number;
  quantity: number;
}

export interface Order {
  id: string;
  buyer_user_id: string;
  shop_id: string;
  recipient_phone_number: string;
  status: 'paid' | 'collected' | 'cancelled';
  total_amount_zmw: number;
  created_at: Timestamp;
  items: OrderItem[];
}

export interface CollectionToken {
  id: string;
  order_id: string;
  shop_id: string;
  is_redeemed: boolean;
  redeemed_at?: Timestamp;
}

let localOrders = [...mockOrders];
let localTokens: CollectionToken[] = [
  {
    id: 'token-demo-1',
    order_id: 'order-1',
    shop_id: 'shop-1',
    is_redeemed: false
  }
];

export async function getOrdersByShopId(shopId: string): Promise<Order[]> {
  // Use mock data in development mode
  if (isDevelopment) {
    return Promise.resolve(localOrders.filter(o => o.shop_id === shopId));
  }

  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('shop_id', '==', shopId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  // Use mock data in development mode
  if (isDevelopment) {
    return Promise.resolve(localOrders.filter(o => o.buyer_user_id === userId));
  }

  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('buyer_user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getCollectionToken(tokenId: string): Promise<CollectionToken | null> {
  // Use mock data in development mode
  if (isDevelopment) {
    const token = localTokens.find(t => t.id === tokenId);
    return Promise.resolve(token || null);
  }

  try {
    const tokenRef = doc(db, 'collection_tokens', tokenId);
    const tokenDoc = await getDoc(tokenRef);
    
    if (tokenDoc.exists()) {
      return {
        id: tokenDoc.id,
        ...tokenDoc.data()
      } as CollectionToken;
    }
    return null;
  } catch (error) {
    console.error('Error fetching collection token:', error);
    return null;
  }
}

export async function processPayment(orderData: {
  shop_id: string;
  recipient_phone_number: string;
  items: OrderItem[];
}) {
  // In development mode, create a mock order
  if (isDevelopment) {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      buyer_user_id: 'demo-user',
      shop_id: orderData.shop_id,
      recipient_phone_number: orderData.recipient_phone_number,
      status: 'paid',
      total_amount_zmw: orderData.items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0),
      created_at: { toDate: () => new Date() } as any,
      items: orderData.items
    };
    localOrders.unshift(newOrder);

    // Create a mock token
    const newToken: CollectionToken = {
      id: `token-${Date.now()}`,
      order_id: newOrder.id,
      shop_id: orderData.shop_id,
      is_redeemed: false
    };
    localTokens.push(newToken);

    console.log('Mock: Payment processed', newOrder);
    return Promise.resolve({ success: true, orderId: newOrder.id, tokenId: newToken.id });
  }

  try {
    // Call the Cloud Function
    const processPaymentFn = httpsCallable(functions, 'processPayment');
    const result = await processPaymentFn(orderData);
    return result.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}

export async function redeemToken(tokenId: string) {
  // In development mode, update the mock token
  if (isDevelopment) {
    const token = localTokens.find(t => t.id === tokenId);
    if (token) {
      token.is_redeemed = true;
      token.redeemed_at = { toDate: () => new Date() } as any;
      
      // Update order status
      const order = localOrders.find(o => o.id === token.order_id);
      if (order) {
        order.status = 'collected';
      }
      
      console.log('Mock: Token redeemed', token);
    }
    return Promise.resolve({ success: true });
  }

  try {
    // Call the Cloud Function
    const redeemTokenFn = httpsCallable(functions, 'redeemToken');
    const result = await redeemTokenFn({ tokenId });
    return result.data;
  } catch (error) {
    console.error('Error redeeming token:', error);
    throw error;
  }
}
