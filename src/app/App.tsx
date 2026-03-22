import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ScanningScreen } from './screens/ScanningScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AddMealScreen } from './screens/AddMealScreen';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      {/* Full width on mobile, centered card on desktop */}
      <div className="w-full md:max-w-[390px] min-h-screen md:h-screen bg-white relative md:overflow-hidden md:shadow-2xl">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/scan" element={<ScanningScreen />} />
            <Route path="/result" element={<ResultScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/add-meal" element={<AddMealScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
