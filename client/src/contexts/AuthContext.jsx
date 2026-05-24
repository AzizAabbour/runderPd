import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, me as meRequest, register as registerRequest } from '@/services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => window.localStorage.getItem('file-tools-token'));
  const [loading, setLoading] = useState(Boolean(token));
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        setLoading(true);
        const response = await meRequest();
        if (cancelled) return;
        setUser(response.data.user);
      } catch {
        if (!cancelled) {
          window.localStorage.removeItem('file-tools-token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(() => {
    const persistAuth = (nextToken, nextUser) => {
      if (nextToken) {
        window.localStorage.setItem('file-tools-token', nextToken);
      } else {
        window.localStorage.removeItem('file-tools-token');
      }
      setToken(nextToken);
      setUser(nextUser ?? null);
    };

    return {
      user,
      token,
      loading,
      initialized,
      isAuthenticated: Boolean(user && token),
      login: async (payload) => {
        const response = await loginRequest(payload);
        persistAuth(response.data.token, response.data.user);
        return response.data;
      },
      register: async (payload) => {
        const response = await registerRequest(payload);
        persistAuth(response.data.token, response.data.user);
        return response.data;
      },
      logout: () => persistAuth(null, null),
      refreshUser: async () => {
        const response = await meRequest();
        setUser(response.data.user);
        return response.data.user;
      },
    };
  }, [loading, token, user, initialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

