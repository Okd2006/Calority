import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../utils/auth';

export function LoginScreen() {
  const { user, loading, isGuest, signInWithGoogle, signInAsGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (user || isGuest)) navigate('/home', { replace: true });
  }, [user, isGuest, loading, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-8 py-16"
      style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(to bottom, #A8E6B0 0%, #F0FAF1 100%)' }}
    >
      {/* Logo + tagline */}
      <div />
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-24 h-24 rounded-full shadow-lg overflow-hidden">
          <img
            src="/CALORITYLOGO.png"
            alt="Calority"
            className="w-full h-full object-cover scale-[1.18]"
          />
        </div>
        <div className="text-center">
          <h1 className="text-4xl tracking-tight" style={{ fontWeight: 700, color: '#1F2937' }}>Calority</h1>
          <p className="text-gray-500 mt-2 text-base">AI-powered calorie tracking</p>
        </div>

        {/* Features list */}
        <div className="w-full space-y-3 mt-4">
          {[
            { icon: '📸', text: 'Snap a photo — get instant macros' },
            { icon: '📊', text: 'Track progress against your goals' },
            { icon: '🕐', text: 'Full meal history, synced everywhere' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-sm border border-gray-100">
              <span className="text-2xl">{icon}</span>
              <p className="text-sm text-gray-600" style={{ fontWeight: 500 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Google sign in */}
        <button
          onClick={signInWithGoogle}
          className="w-full mt-4 py-4 rounded-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 shadow-sm active:scale-95 transition-transform"
        >
          {/* Google logo SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          <span className="text-base text-gray-700" style={{ fontWeight: 600 }}>Continue with Google</span>
        </button>

        {/* Guest mode */}
        <button
          onClick={signInAsGuest}
          className="w-full py-4 rounded-full border-2 border-dashed border-gray-200 text-gray-400 active:scale-95 transition-transform"
          style={{ fontWeight: 500 }}
        >
          Continue as Guest
        </button>
        <p className="text-xs text-gray-300 text-center -mt-2">Guest data is stored locally only</p>
      </div>

      <p className="text-xs text-gray-400 text-center">
        By continuing, you agree to our Terms of Service
      </p>
    </div>
  );
}

