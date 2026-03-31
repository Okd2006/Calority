import { useState } from 'react';
import { Home, Clock, User, ScanLine } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { ScanSheet } from './ScanSheet';

export function BottomNav() {
  const location = useLocation();
  const [showScan, setShowScan] = useState(false);

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/history', icon: Clock, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:max-w-[390px] md:mx-auto bg-white"
        style={{
          borderTop: '1.5px solid #F0F0F0',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-around h-16 px-2">

          {/* Home */}
          <NavItem path="/home" icon={Home} label="Home" active={location.pathname === '/home'} />

          {/* History */}
          <NavItem path="/history" icon={Clock} label="History" active={location.pathname === '/history'} />

          {/* Scan — center, opens sheet */}
          <button
            onClick={() => setShowScan(true)}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2"
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
              style={{
                backgroundColor: location.pathname === '/scan' ? '#1C1917' : '#EDEAE6',
              }}
            >
              <ScanLine
                className="w-5 h-5"
                style={{ color: location.pathname === '/scan' ? 'white' : '#374151' }}
                strokeWidth={2}
              />
            </div>
            <span
              className="text-[10px]"
              style={{
                color: location.pathname === '/scan' ? '#1C1917' : '#374151',
                fontWeight: location.pathname === '/scan' ? 600 : 400,
              }}
            >
              Scan
            </span>
          </button>

          {/* Profile */}
          <NavItem path="/profile" icon={User} label="Profile" active={location.pathname === '/profile'} />

        </div>
      </nav>

      {showScan && <ScanSheet onClose={() => setShowScan(false)} />}
    </>
  );
}

function NavItem({ path, icon: Icon, label, active }: {
  path: string; icon: React.ElementType; label: string; active: boolean;
}) {
  return (
    <Link
      to={path}
      className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-[48px]"
    >
      <Icon
        className="w-5 h-5 transition-colors"
        style={{ color: active ? '#5C7A5F' : '#374151' }}
        strokeWidth={active ? 2.5 : 1.8}
      />
      <span
        className="text-[10px] transition-colors"
        style={{ color: active ? '#5C7A5F' : '#374151', fontWeight: active ? 600 : 400 }}
      >
        {label}
      </span>
    </Link>
  );
}
