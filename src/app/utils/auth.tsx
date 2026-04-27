import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const GUEST_KEY = 'calority_guest';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(GUEST_KEY) === 'true') {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Native: intercept OAuth callback URL with tokens in hash fragment
    const urlListener = App.addListener('appUrlOpen', async ({ url }) => {
      if (url.includes('auth/callback')) {
        const hashOrQuery = url.includes('#') ? url.split('#')[1] : url.split('?')[1];
        const params = new URLSearchParams(hashOrQuery);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (!error && data.session) {
            setSession(data.session);
            setUser(data.session.user);
            setLoading(false);
          }
        }
        await Browser.close();
      }
    });

    return () => {
      subscription.unsubscribe();
      urlListener.then(l => l.remove());
    };
  }, []);

  const signInWithGoogle = async () => {
    if (Capacitor.isNativePlatform()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com.example.calority://auth/callback',
          skipBrowserRedirect: true,
        },
      });
      if (error || !data.url) return;
      await Browser.open({ url: data.url });
    } else {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/auth/callback' },
      });
    }
  };

  const signInAsGuest = () => {
    localStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  };

  const signOut = async () => {
    localStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isGuest, signInWithGoogle, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
