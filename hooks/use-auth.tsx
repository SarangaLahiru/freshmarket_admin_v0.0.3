'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthToken, AuthResponse, LoginCredentials, User, Organization, Role } from '@/types/auth';
import { decodeToken, isTokenExpired } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  token: AuthToken | null;
  user: User | null;
  organization: Organization | null;
  role: Role | null;
  permissions: string[];
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isEmployee: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          const decodedToken = decodeToken(storedToken);
          if (decodedToken && !isTokenExpired(decodedToken)) {
            setToken(decodedToken);
            apiClient.setToken(storedToken);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response: AuthResponse = await apiClient.login(credentials);
      
      const decodedToken = decodeToken(response.token);
      if (!decodedToken) {
        throw new Error('Invalid token received');
      }

      setToken(decodedToken);
      setUser(response.user);
      setOrganization(response.organization);
      setRole(response.role);
      setPermissions(response.permissions);

      apiClient.setToken(response.token);
      localStorage.setItem('auth_token', response.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setOrganization(null);
    setRole(null);
    setPermissions([]);
    
    apiClient.clearToken();
    localStorage.removeItem('auth_token');
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission) || role?.name === 'admin';
  };

  const isAdmin = (): boolean => {
    return role?.name === 'admin';
  };

  const isEmployee = (): boolean => {
    return role?.name === 'employee';
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        organization,
        role,
        permissions,
        login,
        logout,
        isLoading,
        hasPermission,
        isAdmin,
        isEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}