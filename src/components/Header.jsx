import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, logout, isAuthenticated } from '../utils/auth';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 사용자 정보 확인
    if (isAuthenticated()) {
      setUser(getCurrentUser());
      setAuthenticated(true);
    }

    // 커스텀 이벤트 리스너 (로그인/로그아웃 시 업데이트)
    const handleAuthChange = () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setAuthenticated(false);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: '홈' },
    { to: '/concepts', label: '개념' },
    { to: '/papers', label: '논문 요약' },
    { to: '/visualizations', label: '시각화' },
    { to: '/calculator', label: '계산기' },
    { to: '/forum', label: '게시판' },
    { to: '/glossary', label: '용어 사전' },
    { to: '/references', label: '참고 자료' },
    ...(authenticated && user ? [{ to: '/notes', label: '노트' }] : []),
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
    } border-b backdrop-blur`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-500 dark:text-blue-400 whitespace-nowrap">
            Astro Hub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition text-sm lg:text-base ${
                  isDark
                    ? 'text-gray-300 hover:text-blue-400'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 테마 토글 */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition text-lg ${
                isDark
                  ? 'border-gray-700 hover:bg-gray-800'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
              aria-label="테마 전환"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* 사용자 메뉴 또는 로그인 버튼 */}
            {authenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`p-2 rounded-lg border transition ${
                    isDark
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  👤 {user.username}
                </button>
                {isUserMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}>
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 first:rounded-t-lg ${
                        isDark
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      프로필
                    </Link>
                    <Link
                      to="/bookmarks"
                      className={`block px-4 py-2 ${
                        isDark
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      북마크
                    </Link>
                    <Link
                      to="/notes"
                      className={`block px-4 py-2 ${
                        isDark
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      노트
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 last:rounded-b-lg ${
                        isDark
                          ? 'text-red-400 hover:bg-gray-700'
                          : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg border transition ${
                    isDark
                      ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-lg transition text-white ${
                    isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  회원가입
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition text-lg ${
                isDark
                  ? 'border-gray-700 hover:bg-gray-800'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
              aria-label="테마 전환"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition ${
                isDark
                  ? 'text-gray-300 hover:text-blue-400'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              aria-label="메뉴"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className={`md:hidden mt-4 space-y-2 pb-4 border-t transition-colors duration-300 pt-4 ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 transition ${
                  isDark
                    ? 'text-gray-300 hover:text-blue-400'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile 사용자 메뉴 */}
            {authenticated && user ? (
              <>
                <div className={`py-2 border-t transition-colors duration-300 ${
                  isDark ? 'border-gray-800' : 'border-gray-200'
                } mt-2 pt-2`}>
                  <div className={`px-2 py-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.username}
                  </div>
                  <Link
                    to="/profile"
                    className={`block py-2 transition ${
                      isDark
                        ? 'text-gray-300 hover:text-blue-400'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    프로필
                  </Link>
                  <Link
                    to="/bookmarks"
                    className={`block py-2 transition ${
                      isDark
                        ? 'text-gray-300 hover:text-blue-400'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    북마크
                  </Link>
                  <Link
                    to="/notes"
                    className={`block py-2 transition ${
                      isDark
                        ? 'text-gray-300 hover:text-blue-400'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    노트
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left py-2 transition ${
                      isDark
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <div className={`py-2 border-t transition-colors duration-300 mt-2 pt-2 ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <Link
                  to="/login"
                  className={`block py-2 transition ${
                    isDark
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className={`block py-2 transition ${
                    isDark
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
