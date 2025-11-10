// Mock data for development mode when Firebase is not configured

import { Shop } from '../api/shops';
import { Product } from '../api/products';
import { Order } from '../api/orders';

export const mockShops: Shop[] = [
  {
    id: 'shop-1',
    owner_user_id: 'user-shop-1',
    shop_name: 'The Cake Palace',
    address: 'Plot 123, Cairo Road, Lusaka',
    logo_image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    is_verified: true,
    payout_details: {
      type: 'mobile_money',
      number: '+260971234567'
    }
  },
  {
    id: 'shop-2',
    owner_user_id: 'user-shop-2',
    shop_name: 'Sweet Treats Bakery',
    address: 'Shop 45, Manda Hill Mall, Lusaka',
    logo_image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400',
    is_verified: true
  },
  {
    id: 'shop-3',
    owner_user_id: 'user-shop-3',
    shop_name: 'Gourmet Delights',
    address: '789 Independence Avenue, Kitwe',
    logo_image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    is_verified: true
  },
  {
    id: 'shop-4',
    owner_user_id: 'user-shop-4',
    shop_name: 'Artisan Chocolates',
    address: 'East Park Mall, Lusaka',
    logo_image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
    is_verified: true
  }
];

export const mockProducts: Product[] = [
  // The Cake Palace products
  {
    id: 'prod-1',
    shop_id: 'shop-1',
    name: 'Red Velvet Cake',
    price_zmw: 850.00,
    description: 'Classic red velvet cake with cream cheese frosting',
    image_url: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400',
    is_available: true
  },
  {
    id: 'prod-2',
    shop_id: 'shop-1',
    name: 'Chocolate Truffle Cake',
    price_zmw: 950.00,
    description: 'Rich chocolate cake with truffle frosting',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    is_available: true
  },
  {
    id: 'prod-3',
    shop_id: 'shop-1',
    name: 'Vanilla Birthday Cake',
    price_zmw: 750.00,
    description: 'Light and fluffy vanilla cake perfect for celebrations',
    image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e5b80668?w=400',
    is_available: true
  },
  // Sweet Treats Bakery products
  {
    id: 'prod-4',
    shop_id: 'shop-2',
    name: 'Artisan Cupcakes (6 pack)',
    price_zmw: 250.00,
    description: 'Assorted gourmet cupcakes',
    image_url: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400',
    is_available: true
  },
  {
    id: 'prod-5',
    shop_id: 'shop-2',
    name: 'Fruit Tart',
    price_zmw: 450.00,
    description: 'Fresh seasonal fruit on a crispy tart shell',
    image_url: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400',
    is_available: true
  },
  // Gourmet Delights products
  {
    id: 'prod-6',
    shop_id: 'shop-3',
    name: 'Tiramisu',
    price_zmw: 550.00,
    description: 'Italian classic with coffee and mascarpone',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    is_available: true
  },
  {
    id: 'prod-7',
    shop_id: 'shop-3',
    name: 'Cheesecake',
    price_zmw: 650.00,
    description: 'Creamy New York style cheesecake',
    image_url: 'https://images.unsplash.com/photo-1533134242916-b3a2e2d3e5a4?w=400',
    is_available: true
  },
  // Artisan Chocolates products
  {
    id: 'prod-8',
    shop_id: 'shop-4',
    name: 'Luxury Chocolate Box',
    price_zmw: 800.00,
    description: 'Premium handcrafted chocolates in a gift box',
    image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
    is_available: true
  },
  {
    id: 'prod-9',
    shop_id: 'shop-4',
    name: 'Chocolate Truffles',
    price_zmw: 350.00,
    description: 'Hand-rolled chocolate truffles',
    image_url: 'https://images.unsplash.com/photo-1548848932-0d2f0bea0766?w=400',
    is_available: true
  }
];

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    buyer_user_id: 'demo-user',
    shop_id: 'shop-1',
    recipient_phone_number: '+260977123456',
    status: 'paid',
    total_amount_zmw: 850.00,
    created_at: { toDate: () => new Date('2025-11-08') } as any,
    items: [
      {
        product_id: 'prod-1',
        name: 'Red Velvet Cake',
        price_at_purchase: 850.00,
        quantity: 1
      }
    ]
  },
  {
    id: 'order-2',
    buyer_user_id: 'demo-user',
    shop_id: 'shop-2',
    recipient_phone_number: '+260966234567',
    status: 'collected',
    total_amount_zmw: 700.00,
    created_at: { toDate: () => new Date('2025-11-05') } as any,
    items: [
      {
        product_id: 'prod-4',
        name: 'Artisan Cupcakes (6 pack)',
        price_at_purchase: 250.00,
        quantity: 2
      },
      {
        product_id: 'prod-5',
        name: 'Fruit Tart',
        price_at_purchase: 200.00,
        quantity: 1
      }
    ]
  }
];

export const mockUser = {
  uid: 'demo-user',
  email: 'demo@kithly.com',
  displayName: 'Demo User'
};

export const mockUserData = {
  email: 'demo@kithly.com',
  first_name: 'Demo',
  last_name: 'User',
  phone_number: '+260971234567',
  roles: ['customer'],
  shop_id: undefined
};

export const mockShopOwnerData = {
  email: 'owner@cakepalace.com',
  first_name: 'Samson',
  last_name: 'Banda',
  phone_number: '+260971234567',
  roles: ['customer', 'shop_owner'],
  shop_id: 'shop-1'
};
