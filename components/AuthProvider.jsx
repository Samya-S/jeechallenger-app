'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext({
  user: null,
  session: null,
  data: null,
  status: 'loading',
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshSession: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          setStatus('authenticated');
          return data.user;
        }
      }
      setUser(null);
      setStatus('unauthenticated');
      return null;
    } catch {
      setUser(null);
      setStatus('unauthenticated');
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetch('/api/auth/session', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.user) {
          setUser(data.user);
          setStatus('authenticated');
        } else {
          setUser(null);
          setStatus('unauthenticated');
        }
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus('unauthenticated');
      });

    // Re-check session when window regains focus
    const onFocus = () => {
      fetchSession();
    };
    window.addEventListener('focus', onFocus);
    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchSession]);

  const signIn = useCallback((provider = 'google', options = {}) => {
    const callbackUrl = options.callbackUrl || '/';
    const target = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    window.location.href = target;
  }, []);

  const signOut = useCallback(async (options = {}) => {
    const callbackUrl = options.callbackUrl || '/';
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('[auth] Logout error:', err);
    }
    setUser(null);
    setStatus('unauthenticated');
    window.location.href = callbackUrl;
  }, []);

  const value = useMemo(() => {
    const sessionObj = user ? { user } : null;
    return {
      user,
      session: sessionObj,
      data: sessionObj, // For NextAuth compatibility: const { data: session } = useSession()
      status,           // 'loading' | 'authenticated' | 'unauthenticated'
      loading: status === 'loading',
      signIn,
      signOut,
      refreshSession: fetchSession,
    };
  }, [user, status, signIn, signOut, fetchSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// NextAuth drop-in replacement alias
export function useSession() {
  return useAuth();
}

export async function signIn(provider = 'google', options = {}) {
  const callbackUrl = options.callbackUrl || '/';
  const target = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  window.location.href = target;
}

export async function signOut(options = {}) {
  const callbackUrl = options.callbackUrl || '/';
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error('[auth] Logout error:', err);
  }
  window.location.href = callbackUrl;
}
