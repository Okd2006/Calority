import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ScanningScreen } from './screens/ScanningScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SplashScreen,
  },
  {
    path: '/home',
    Component: HomeScreen,
  },
  {
    path: '/scan',
    Component: ScanningScreen,
  },
  {
    path: '/result',
    Component: ResultScreen,
  },
  {
    path: '/history',
    Component: HistoryScreen,
  },
  {
    path: '/profile',
    Component: ProfileScreen,
  },
]);
