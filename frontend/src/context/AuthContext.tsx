'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User, ApiError } from '@/lib/api';

/**
 * The value provided by AuthContext and returned by useAuth()
 * Contains authentication state and operations
 */
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Context object will come from provider
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// auth provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // setup state
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // If there's a token, try to get current user
                if (api.client.isAuthenticated()) {
                const currentUser = await api.auth.getCurrentUser();
                setUser(currentUser);
                }
            } catch (error) {
                // Token is invalid or expired - clear it
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
                // Always set loading to false when done
                setLoading(false);
            }
        };

        checkAuth();
    }, []);
    // login
    const login = async (email: string, password: string) => {
        const response = await api.auth.login(email, password);
        setUser(response.user);
    };

    const logout = async () => {
        await api.auth.logout();
        setUser(null);
    };

    // Return the context
      return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}

// The auth hook.
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}