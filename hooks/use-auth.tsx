'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import type { AuthToken, AuthResponse, LoginCredentials, User, Organization, Role } from '@/types/auth';
import { decodeToken, isTokenExpired } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';

type MePayload = {
  user_id: string;
  organization_id: string;
  role: string;
  permissions: string[];
};

interface AuthContextType {
  token: AuthToken | null;
  user: User | null;
  organization: Organization | null;
  role: Role | null;
  permissions: string[];
  login: (credentials: LoginCredentials & { tenant?: string }) => Promise<void>;
  logout: () => Promise<void>;
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

  // ---------- helpers ----------
  const persistAuth = (resp: AuthResponse) => {
    localStorage.setItem('auth_token', resp.token);
    if (resp.organization?.slug) {
      localStorage.setItem('tenant_slug', resp.organization.slug);
      apiClient.setTenant(resp.organization.slug);
    } else if (resp.organization?.id) {
      localStorage.setItem('tenant_slug', resp.organization.id);
      apiClient.setTenant(resp.organization.id);
    }

    localStorage.setItem('auth_user', JSON.stringify(resp.user));
    localStorage.setItem('auth_org', JSON.stringify(resp.organization ?? null));
    localStorage.setItem('auth_role', JSON.stringify(resp.role ?? null));
    localStorage.setItem('auth_perms', JSON.stringify(resp.permissions ?? []));
  };

  const clearPersisted = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('tenant_slug');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_org');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_perms');
  };

  const applyStateFromPersist = () => {
    const u = localStorage.getItem('auth_user');
    const o = localStorage.getItem('auth_org');
    const r = localStorage.getItem('auth_role');
    const p = localStorage.getItem('auth_perms');

    if (u) setUser(JSON.parse(u));
    if (o) setOrganization(JSON.parse(o));
    if (r) setRole(JSON.parse(r));
    if (p) setPermissions(JSON.parse(p));
  };

  const resetState = () => {
    setToken(null);
    setUser(null);
    setOrganization(null);
    setRole(null);
    setPermissions([]);
  };

  // ---------- initial rehydrate ----------
  useEffect(() => {
    (async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedTenant = localStorage.getItem('tenant_slug');

        if (!storedToken || !storedTenant) {
          setIsLoading(false);
          return;
        }

        const decoded = decodeToken(storedToken);
        if (!decoded || isTokenExpired(decoded)) {
          clearPersisted();
          setIsLoading(false);
          return;
        }

        // Set client credentials before calling /auth/me
        apiClient.setToken(storedToken);
        apiClient.setTenant(storedTenant);

        // Optimistic UI: show cached user/org immediately
        applyStateFromPersist();
        setToken(decoded);

        // Validate token & rehydrate live permissions/role
        const me = await apiClient.me(); // GET /auth/me
        const meData = me as MePayload;

        setPermissions(meData.permissions || []);
        setRole((prev) =>
          meData.role ? { ...(prev ?? { id: '', description: '' }), name: meData.role } : prev
        );
      } catch {
        // any error -> force logout
        clearPersisted();
        resetState();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ---------- actions ----------
  const login = async (credentials: LoginCredentials & { tenant?: string }) => {
    setIsLoading(true);
    try {
      // If your backend DOESN'T require tenant for /auth/login, this is optional
      if (credentials.tenant) {
        apiClient.setTenant(credentials.tenant);
        localStorage.setItem('tenant_slug', credentials.tenant);
      }

      const resp = await apiClient.login(credentials);

      const decoded = decodeToken(resp.token);
      if (!decoded) throw new Error('Invalid token received');

      // Keep client in sync
      apiClient.setToken(resp.token);
      if (resp.organization?.slug) apiClient.setTenant(resp.organization.slug);
      else if (resp.organization?.id) apiClient.setTenant(resp.organization.id);

      // Persist and set state
      persistAuth(resp);
      setToken(decoded);
      setUser(resp.user);
      setOrganization(resp.organization ?? null);
      setRole(resp.role ?? null);
      setPermissions(resp.permissions ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout(); // server is stateless; OK if it just 200s
    } catch {
      // ignore
    }
    apiClient.clearToken();
    apiClient.clearTenant();
    clearPersisted();
    resetState();
  };

  // ---------- computed ----------
  const hasPermission = (permission: string) =>
    (role?.name || '').toLowerCase() === 'admin' || permissions.includes(permission);

  const isAdmin = () => (role?.name || '').toLowerCase() === 'admin';
  const isEmployee = () => (role?.name || '').toLowerCase() === 'employee';

  const value = useMemo<AuthContextType>(
    () => ({
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
    }),
    [token, user, organization, role, permissions, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
