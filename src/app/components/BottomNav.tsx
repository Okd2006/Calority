import { Home, Camera, History, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/scan', icon: Camera, label: 'Scan' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white z-50 md:max-w-[390px] md:mx-auto"
      style={{
        boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-[48px]"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${isActive ? 'text-[#2ECC71]' : 'text-[#7F8C8D]'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-xs font-medium transition-colors ${isActive ? 'text-[#2ECC71]' : 'text-[#7F8C8D]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
