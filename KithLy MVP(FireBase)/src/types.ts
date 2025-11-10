export interface Product {
  id: string;
  shop_id: string;
  name: string;
  price_zmw: number;
  image_url: string;
  is_available: boolean;
  createdAt?: any; // Firebase Timestamp
}

export interface Shop {
  id: string;
  owner_user_id: string;
  shop_name: string;
  address: string;
  logo_image_url: string;
  is_verified: boolean;
  payout_details?: {
    type: 'mobile_money' | 'bank';
    provider?: string;
    number?: string;
    bank_name?: string;
    account?: string;
  };
}
