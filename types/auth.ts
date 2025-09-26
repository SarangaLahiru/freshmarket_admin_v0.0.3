export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  is_verified: boolean;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  is_active: boolean;
}

export interface AuthToken {
  user_id: string;
  organization_id: string;
  role: string;
  permissions: string[];
  exp: number;
  iat: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  organization_slug?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  organization: Organization;
  role: Role;
  permissions: string[];
}