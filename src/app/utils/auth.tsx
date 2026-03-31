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

    // Handle deep link — app receives the callback URL with ?code=
    const urlListener = App.addListener('appUrlOpen', async ({ url }) => {
      console.log('[Auth] appUrlOpen fired:', url);
      if (url.includes('auth/callback')) {
        // Tokens come in the hash fragment (#access_token=...) for implicit flow
        const hashOrQuery = url.includes('#') ? url.split('#')[1] : url.split('?')[1];
        const params = new URLSearchParams(hashOrQuery);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
          console.log('[Auth] setSession:', data.session?.user?.email, error);
          if (!error && data.session) {
            setSession(data.session);
            setUser(data.session.user);
            setLoading(false);
          }
        }
        await Browser.close();
      }
    });

    // Fallback: when browser closes, re-check session
    const browserListener = Browser.addListener('browserFinished', async () => {
      console.log('[Auth] browserFinished fired');
      const { data } = await supabase.auth.getSession();
      console.log('[Auth] session after browser close:', data.session?.user?.email);
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setLoading(false);
      }
    });

    // Fallback 2: when app comes to foreground, re-check session
    const appStateListener = App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        const { data } = await supabase.auth.getSession();
        console.log('[Auth] appStateChange active, session:', data.session?.user?.email);
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          setLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      urlListener.then(l => l.remove());
      browserListener.then(l => l.remove());
      appStateListener.then(l => l.remove());
    };
  }, []);

  const signInWithGoogle = async () => {
    const redirectTo = Capacitor.isNativePlatform()
      ? 'com.example.calority://auth/callback'
      : window.location.origin + '/auth/callback';

    if (Capacitor.isNativePlatform()) {
      // On native: open in-app browser, intercept redirect via appUrlOpen
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });
      if (error || !data.url) return;
      await Browser.open({ url: data.url });
    } else {
      // On web: normal redirect flow
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
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
