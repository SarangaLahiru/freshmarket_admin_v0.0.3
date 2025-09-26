export interface Offer {
  id: string;
  organization_id: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'flash_sale' | 'bundle';
  title: string;
  description?: string;
  value: number;
  valid_until: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  min_purchase?: number;
  max_discount?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOfferRequest {
  type: Offer['type'];
  title: string;
  description?: string;
  value: number;
  valid_until: string;
  usage_limit?: number;
  min_purchase?: number;
  max_discount?: number;
  category_ids?: string[];
  product_ids?: string[];
}