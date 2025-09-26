export interface Banner {
  id: string;
  organization_id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  image_alt?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  link_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerRequest {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  image_alt?: string;
  icon?: string;
  link_url?: string;
  sort_order?: number;
}