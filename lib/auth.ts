import jwt from 'jsonwebtoken';
import { AuthToken } from '@/types/auth';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function decodeToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.decode(token) as AuthToken;
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function isTokenExpired(token: AuthToken): boolean {
  return Date.now() >= token.exp * 1000;
}

export function hasPermission(token: AuthToken, permission: string): boolean {
  return token.permissions.includes(permission) || token.role === 'admin';
}

export function isAdmin(token: AuthToken): boolean {
  return token.role === 'admin';
}

export function isEmployee(token: AuthToken): boolean {
  return token.role === 'employee';
}

// Permission constants
export const PERMISSIONS = {
  // Product permissions
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  
  // User permissions
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  
  // Offer permissions
  OFFERS_VIEW: 'offers:view',
  OFFERS_CREATE: 'offers:create',
  OFFERS_UPDATE: 'offers:update',
  OFFERS_DELETE: 'offers:delete',
  
  // Banner permissions
  BANNERS_VIEW: 'banners:view',
  BANNERS_CREATE: 'banners:create',
  BANNERS_UPDATE: 'banners:update',
  BANNERS_DELETE: 'banners:delete',
  
  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Organization permissions
  ORG_SETTINGS: 'org:settings',
} as const;