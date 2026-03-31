import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import { AuthProvider, useAuth } from './utils/auth';
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ScanningScreen } from './screens/ScanningScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AddMealScreen } from './screens/AddMealScreen';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      navigate(user ? '/home' : '/login', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-green-200 border-t-green-500 animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, isGuest } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-green-200 border-t-green-500 animate-spin" />
    </div>
  );
  return (user || isGuest) ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
      <Route path="/scan" element={<ProtectedRoute><ScanningScreen /></ProtectedRoute>} />
      <Route path="/result" element={<ProtectedRoute><ResultScreen /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="/add-meal" element={<ProtectedRoute><AddMealScreen /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-full md:max-w-[390px] min-h-screen md:h-screen bg-white relative md:overflow-hidden md:shadow-2xl">
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}
