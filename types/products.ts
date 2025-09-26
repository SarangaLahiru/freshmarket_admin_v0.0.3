export interface Category {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  image?: string;
  product_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  category_id: string;
  category?: Category;
  image?: string;
  unit: string;
  stock_count: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_on_sale: boolean;
  in_stock: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category_id: string;
  image?: string;
  unit: string;
  stock_count: number;
  is_featured?: boolean;
  is_on_sale?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}