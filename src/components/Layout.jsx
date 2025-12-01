import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Header from './Header';
import ScrollProgressBar from './ScrollProgressBar';

export default function Layout() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-950 text-gray-100' 
        : 'bg-white text-gray-900'
    }`}>
      <ScrollProgressBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className={`border-t py-6 text-center text-sm transition-colors duration-300 ${
        isDark
          ? 'bg-gray-900 border-gray-800 text-gray-400'
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <p>© 2025 Astrophysics Hub · 학습용 요약 사이트</p>
      </footer>
    </div>
  );
}
